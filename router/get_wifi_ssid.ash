#!/bin/ash
echo "Content-type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

SSID=$(iwinfo wlan1 info | grep 'SSID' | awk -F '"' '{print $2}')
echo "{ \"ssid\": \"$SSID\" }"