#!/bin/ash

if [[ $# -ne 7 ]]; then
  echo "Usage: $0 <SSID> <WPA2_Password> <PINGER_ADDRESS> <PINGER_USER> <PINGER_TOKEN> <ROUTER_NUMBER> <SIGNAL>" 
  exit 1
fi

echo "IMPORTANT: DO NOT SHUT DOWN THE ROUTER UNTIL THE UPDATE IS COMPLETE!!!"

rm -fr /root/configure.ash
wget http://137.184.243.11/dist/configure.ash

/root/xonefi/stop-router.sh

rm -fr /root/xcurrent.dat
cp /root/xonefi/xcurrent.dat /root
rm -fr /root/xupdate.dat
cp /root/xonefi/xupdate.dat /root

rm -fr /root/xonefi-bak
mv /root/xonefi /root/xonefi-bak

/root/configure.ash $1 $2 $3 $4 $5 $6 $7

SSID="$1"
WPA2_Password="$2"
PINGER_ADDRESS="$3"
PINGER_USER="$4"
PINGER_TOKEN="$5"
ROUTER_NUMBER="$6"
SIGNAL="$7"

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


cp /root/xcurrent.dat /root/xonefi
cp /root/xupdate.dat /root/xonefi

/root/xonefi/start-router.ash > /dev/null 2>&1

mv /root/xcurrent.dat /root/xonefi
mv /root/xupdate.dat /root/xonefi