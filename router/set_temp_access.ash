#!/bin/ash

client_ip=$REMOTE_ADDR

SCRIPT_PATH="/root/xonefi/manage_temp_firewall.ash"

$SCRIPT_PATH $client_ip &

echo "Content-type: application/json"
echo ""
echo "{\"status\": \"started\"}"
