#!/bin/ash

IP=$REMOTE_ADDR

ndsctl deauth $MAC

echo "Deauthenticated user with MAC: $MAC" >> /root/xonefi.log
