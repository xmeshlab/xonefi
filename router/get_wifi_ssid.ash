#!/bin/ash
echo "Content-type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

SSID=$(iwinfo phy1-ap0 info | grep 'SSID' | awk -F '"' '{print $2}')
echo "{ \"ssid\": \"$SSID\" }"