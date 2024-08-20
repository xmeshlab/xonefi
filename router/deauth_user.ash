#!/bin/ash

IP=$REMOTE_ADDR
echo "$IP" >> /root/xonefi.log
MAC=$(cat /proc/net/arp | grep "$IP" | awk '{print $4}')
echo "$MAC" >> /root/xonefi.log

if [ -z "$MAC" ]; then
        echo "MAC address not found for IP: $IP" >> /root/xonefi.log
        exit 1
fi

ndsctl deauth $MAC

echo "Deauthenticated user with MAC: $MAC" >> /root/xonefi.log