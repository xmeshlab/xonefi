#!/bin/ash

# Function to add a rule to twpolicy.fw
add_rule() {
  local client_ip=$1
  echo "config rule" >> /root/xonefi/twpolicy.fw
  echo "        option src      lan" >> /root/xonefi/twpolicy.fw
  echo "        option src_ip   ${client_ip}" >> /root/xonefi/twpolicy.fw
  echo "        option dest_ip  !137.184.243.11" >> /root/xonefi/twpolicy.fw
  echo "        option dest     wan" >> /root/xonefi/twpolicy.fw
  echo "        option proto    all" >> /root/xonefi/twpolicy.fw
  echo "        option target   ACCEPT" >> /root/xonefi/twpolicy.fw
  echo "add_rule() called" >> /root/xonefi.log

  cat /root/xonefi/firewall.orig /root/xonefi/twpolicy.fw /root/xonefi/wpolicy.fw /root/xonefi/policy.fw /root/xonefi/firewall-blocker.orig > /etc/config/firewall
  /etc/init.d/firewall restart
  echo "firewall restarted from temp manager" >> /root/xonefi.log
}

# Function to remove a rule from twpolicy.fw
remove_rule() {
  local client_ip=$1
  local temp_file=$(mktemp)

  awk -v ip="${client_ip}" '
    $0 ~ "option src_ip   "ip {delete_block=1}
    $0 ~ "config rule" {if (delete_block) {delete_block=0; next}}
    {if (!delete_block) print}
    $0 ~ "option target   ACCEPT" {if (delete_block) {delete_block=0; next}}
  ' /root/xonefi/twpolicy.fw > ${temp_file}

  mv ${temp_file} /root/xonefi/twpolicy.fw

  # Clean up the twpolicy.fw file if it's empty or only contains header lines
  if ! grep -q 'option src_ip' /root/xonefi/twpolicy.fw; then
    rm /root/xonefi/twpolicy.fw
  fi
  echo "remove_rule() called" >> /root/xonefi.log

  increment_update_dat
}

# Function to increment update.dat
increment_update_dat() {
  local update_file="/root/xonefi/update.dat"
  local current_value=$(cat ${update_file})
  local new_value=$((current_value + 1))
  echo ${new_value} > ${update_file}
  echo "increment_update_dat() called" >> /root/xonefi.log
}

main() {
  local client_ip=$1

  # Check if twpolicy.fw exists, if not create it
  if [ ! -f /root/xonefi/twpolicy.fw ]; then
    touch /root/xonefi/twpolicy.fw
  fi

  # Add rule
  add_rule ${client_ip}

  # Wait for 1 minutes
  sleep 60

  # Remove rule
  remove_rule ${client_ip}

  # Check if twpolicy.fw is empty, delete if it is
  if [ ! -s /root/xonefi/twpolicy.fw ]; then
    rm /root/xonefi/twpolicy.fw
  fi

  # Log completion
  echo "Temporary rule for ${client_ip} added and removed." >> /root/xonefi.log
}

main $1