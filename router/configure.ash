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
  wifi_iface=0  # Index for the 5GHz interface
else
  wifi_iface=1  # Index for the 2.4GHz interface
fi

uci set wireless.@wifi-iface[$wifi_iface].ssid="${SSID}"
uci set wireless.@wifi-iface[$wifi_iface].mode="ap"
uci set wireless.@wifi-iface[$wifi_iface].encryption="psk2"
uci set wireless.@wifi-iface[$wifi_iface].key="${WPA2_Password}"
uci commit wireless
wifi

#uci set network.lan.ipaddr='192.168.99.1'
#uci commit network

opkg update
opkg install wget procps-ng-pkill coreutils-nohup iwinfo nodogsplash

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

sed -i "s|^PINGER_ADDRESS=.*|PINGER_ADDRESS=${PINGER_ADDRESS}|" spuller.ash
sed -i "s|^PINGER_USER=.*|PINGER_USER=${PINGER_USER}|" spuller.ash
sed -i "s|^PINGER_TOKEN=.*|PINGER_TOKEN=${PINGER_TOKEN}|" spuller.ash
sed -i "s|^ROUTER_NUMBER=.*|ROUTER_NUMBER=${ROUTER_NUMBER}|" spuller.ash

# Router Setup
cd /www/cgi-bin/
wget http://137.184.243.11/dist/get_local_ip.ash
wget http://137.184.243.11/dist/get_wifi_ssid.ash
chmod +x get_local_ip.ash get_wifi_ssid.ash
/etc/init.d/uhttpd restart

cd /www/
wget http://137.184.243.11/dist/xonefi-app.tar.gz
tar -xzf xonefi-app.tar.gz
mv dist/ xonefi-app
rm xonefi-app.tar.gz

cd /root/
uci set nodogsplash.@nodogsplash[0].gatewayname='XOneFi'
uci commit nodogsplash

# Copy Captive portal files
cd /etc/nodogsplash/htdocs/
rm -f splash.css splash.html status.html
wget http://137.184.243.11/dist/splash.html
wget http://137.184.243.11/dist/splash.css
wget http://137.184.243.11/dist/status.html
cd images/
wget http://137.184.243.11/dist/xmesh-favicon.jpg
wget http://137.184.243.11/dist/xonefi-logo.jpg

/etc/init.d/nodogsplash restart

# Temp 1 min access configuration
cd /root/xonefi/
wget http://137.184.243.11/dist/manage_temp_firewall.ash
chmod +x manage_temp_firewall.ash
cd /www/cgi-bin/
wget http://137.184.243.11/dist/set_temp_access.ash
chmod +x set_temp_access.ash