#!/bin/ash

IP=$REMOTE_ADDR

ndsctl deauth $IP

echo "Deauthenticated user with IP: $IP" >> /root/xonefi.log
