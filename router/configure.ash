#!/bin/ash

# Usage: ./configure.ash <SSID> <WPA2_Password> <PINGER_ADDRESS> <PINGER_USER> <PINGER_TOKEN> <ROUTER_NUMBER>
# Example ./configure.ash "OFAKgKCQoDjQEMRwAAABkAZNH+uNB0" "d1feb8d074" "137.184.243.11" "d1feb8d074" "ec406fe475aa" "3143" "2.4G"

if [[ $# -ne 7 ]]; then
  echo "Usage: $0 <SSID> <WPA2_Password> <PINGER_ADDRESS> <PINGER_USER> <PINGER_TOKEN> <ROUTER_NUMBER> <SIGNAL>" 
  exit 1
fi

SSID="$1"
WPA2_Password="$2"
PINGER_ADDRESS="$3"
PINGER_USER="$4"
PINGER_TOKEN="$5"
ROUTER_NUMBER="$6"
SIGNAL="$7"

# radio0, radio1: order could be reversed [TOFIX]
if [ "$SIGNAL" = "5G" ]; then
  wifi_iface=1  # Index for the 5GHz interface
else
  wifi_iface=0  # Index for the 2.4GHz interface
fi

uci set wireless.@wifi-iface[$wifi_iface].ssid="${SSID}"
uci set wireless.@wifi-iface[$wifi_iface].mode="ap"
uci set wireless.@wifi-iface[$wifi_iface].encryption="psk2"
uci set wireless.@wifi-iface[$wifi_iface].key="${WPA2_Password}"
uci commit wireless
wifi

opkg update
opkg install wget procps-ng-pkill coreutils-nohup

mkdir xonefi
cd xonefi
wget http://137.184.243.11/dist/router-setup.ash
ash router-setup.ash

sed -i "s|^PINGER_ADDRESS=.*|PINGER_ADDRESS=${PINGER_ADDRESS}|" puller.ash
sed -i "s|^PINGER_USER=.*|PINGER_USER=${PINGER_USER}|" puller.ash
sed -i "s|^PINGER_TOKEN=.*|PINGER_TOKEN=${PINGER_TOKEN}|" puller.ash
sed -i "s|^ROUTER_NUMBER=.*|ROUTER_NUMBER=${ROUTER_NUMBER}|" puller.ash

sed -i "s|^PINGER_ADDRESS=.*|PINGER_ADDRESS=${PINGER_ADDRESS}|" xpuller.ash
sed -i "s|^PINGER_USER=.*|PINGER_USER=${PINGER_USER}|" xpuller.ash
sed -i "s|^PINGER_TOKEN=.*|PINGER_TOKEN=${PINGER_TOKEN}|" xpuller.ash
sed -i "s|^ROUTER_NUMBER=.*|ROUTER_NUMBER=${ROUTER_NUMBER}|" xpuller.ash
