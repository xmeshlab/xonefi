#!/bin/ash
set -e

client_ip=$1

LOCKFILE="/tmp/manage_temp_firewall_${client_ip}.lock"
COUNTER_FILE="/tmp/firewall_rule_counter_${client_ip}.dat"

trap 'rm -f "$LOCKFILE"; exit' INT TERM EXIT

# Check if the lock file exists
if [ -f "$LOCKFILE" ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Script already running for $client_ip" >> /root/xonefi.log
    exit 0
else
    touch "$LOCKFILE"
fi

# Function to add a rule to twpolicy.fw
add_rule() {
    (
        flock -x 200

        if [ -f "$COUNTER_FILE" ]; then
            count=$(cat "$COUNTER_FILE")
            count=$((count + 1))
        else
            count=1
            echo "config rule" >> /root/xonefi/twpolicy.fw
            echo "        option src      lan" >> /root/xonefi/twpolicy.fw
            echo "        option src_ip   ${client_ip}" >> /root/xonefi/twpolicy.fw
            echo "        option dest_ip  !137.184.243.11" >> /root/xonefi/twpolicy.fw
            echo "        option dest     wan" >> /root/xonefi/twpolicy.fw
            echo "        option proto    all" >> /root/xonefi/twpolicy.fw
            echo "        option target   ACCEPT" >> /root/xonefi/twpolicy.fw
            echo "$(date '+%Y-%m-%d %H:%M:%S') - add_rule() - Rule added for IP ${client_ip}" >> /root/xonefi.log
        fi
        echo "$count" > "$COUNTER_FILE"

        cat /root/xonefi/firewall.orig /root/xonefi/twpolicy.fw /root/xonefi/wpolicy.fw /root/xonefi/policy.fw /root/xonefi/firewall-blocker.orig > /etc/config/firewall
        /etc/init.d/firewall reload
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Firewall reloaded from add_rule for IP ${client_ip}" >> /root/xonefi.log

    ) 200>/var/lock/twpolicy.lock
}

# Function to remove a rule from twpolicy.fw
remove_rule() {
    (
        flock -x 200

        echo "$(date '+%Y-%m-%d %H:%M:%S') - remove_rule() - Entered function for IP ${client_ip}" >> /root/xonefi.log

        if [ -f "$COUNTER_FILE" ]; then
            count=$(cat "$COUNTER_FILE")
            echo "$(date '+%Y-%m-%d %H:%M:%S') - remove_rule() - Current count: $count" >> /root/xonefi.log

            # Check if count is a valid number
            if ! echo "$count" | grep -qE '^[0-9]+$'; then
                echo "$(date '+%Y-%m-%d %H:%M:%S') - remove_rule() - Invalid count value: '$count'" >> /root/xonefi.log
                count=1  # Default to 1 to allow decrement
            fi

            count=$((count - 1))
            echo "$(date '+%Y-%m-%d %H:%M:%S') - remove_rule() - Decremented count to ${count}" >> /root/xonefi.log

            if [ "$count" -le 0 ]; then
                rm -f "$COUNTER_FILE"

                # Remove the rule from twpolicy.fw
                temp_file=$(mktemp)
                echo "$(date '+%Y-%m-%d %H:%M:%S') - remove_rule() - temp_file is ${temp_file}" >> /root/xonefi.log

                # Check if twpolicy.fw exists and is not empty
                if [ ! -s /root/xonefi/twpolicy.fw ]; then
                    echo "$(date '+%Y-%m-%d %H:%M:%S') - remove_rule() - twpolicy.fw does not exist or is empty" >> /root/xonefi.log
                else
                    awk -v ip="${client_ip}" '
                        $0 ~ "option src_ip   "ip {delete_block=1}
                        $0 ~ "config rule" {if (delete_block) {delete_block=0; next}}
                        {if (!delete_block) print}
                        $0 ~ "option target   ACCEPT" {if (delete_block) {delete_block=0; next}}
                    ' /root/xonefi/twpolicy.fw > ${temp_file}

                    awk_exit_code=$?
                    if [ $awk_exit_code -ne 0 ]; then
                        echo "$(date '+%Y-%m-%d %H:%M:%S') - remove_rule() - awk command failed with exit code $awk_exit_code" >> /root/xonefi.log
                    fi

                    mv "${temp_file}" /root/xonefi/twpolicy.fw
                    mv_exit_code=$?
                    if [ $mv_exit_code -ne 0 ]; then
                        echo "$(date '+%Y-%m-%d %H:%M:%S') - remove_rule() - mv command failed with exit code $mv_exit_code" >> /root/xonefi.log
                    fi

                    echo "$(date '+%Y-%m-%d %H:%M:%S') - remove_rule() - Rule removed for IP ${client_ip}" >> /root/xonefi.log

                    # Clean up twpolicy.fw if empty
                    if ! grep -q 'option src_ip' /root/xonefi/twpolicy.fw; then
                        rm -f /root/xonefi/twpolicy.fw
                    fi
                fi
            else
                echo "$count" > "$COUNTER_FILE"
                echo "$(date '+%Y-%m-%d %H:%M:%S') - remove_rule() - Counter file updated to ${count} for IP ${client_ip}" >> /root/xonefi.log
            fi
        else
            echo "$(date '+%Y-%m-%d %H:%M:%S') - remove_rule() - COUNTER_FILE does not exist for IP ${client_ip}" >> /root/xonefi.log
        fi

        increment_update_dat

    ) 200>/var/lock/twpolicy.lock
}


# Function to increment update.dat
increment_update_dat() {
    local update_file="/root/xonefi/update.dat"
    if [ -f "${update_file}" ]; then
        local current_value=$(cat ${update_file})
    else
        local current_value=0
    fi
    local new_value=$((current_value + 1))
    echo ${new_value} > ${update_file}
    echo "$(date '+%Y-%m-%d %H:%M:%S') - increment_update_dat() called, new value: ${new_value}" >> /root/xonefi.log
}

main() {
    if [ ! -f /root/xonefi/twpolicy.fw ]; then
        touch /root/xonefi/twpolicy.fw
    fi

    add_rule
    sleep 60
    remove_rule
    rm -f "$LOCKFILE"

    echo "$(date '+%Y-%m-%d %H:%M:%S') - Temporary rule for ${client_ip} added and removed." >> /root/xonefi.log
}

main
