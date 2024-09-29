#!/bin/ash

if [[ $# -ne 7 ]]; then
  echo "Usage: $0 <SSID> <WPA2_Password> <PINGER_ADDRESS> <PINGER_USER> <PINGER_TOKEN> <ROUTER_NUMBER> <SIGNAL>" 
  exit 1
fi

echo "IMPORTANT: DO NOT SHUT DOWN THE ROUTER UNTIL THE UPDATE IS COMPLETE!!!"

/root/xonefi/stop-router.ash

rm -fr /root/xonefi.log
rm -fr /root/xonefix.log
rm -fr /root/xonefis.log

rm -fr /root/xcurrent.dat
cp /root/xonefi/xcurrent.dat /root
rm -fr /root/xupdate.dat
cp /root/xonefi/xupdate.dat /root

rm -fr /root/xonefi-bak
mv /root/xonefi /root/xonefi-bak

rm -fr /www/cgi-bin/get_local_ip.ash
rm -fr /www/cgi-bin/get_wifi_ssid.ash
rm -fr /www/cgi-bin/set_temp_access.ash

rm -fr /www/xonefi-app
rm -fr /etc/nodogsplash/htdocs/splash.html
rm -fr /etc/nodogsplash/htdocs/splash.css
rm -fr /etc/nodogsplash/htdocs/status.html
rm -fr /etc/nodogsplash/htdocs/close.html
rm -fr /etc/nodogsplash/htdocs/images/xmesh-favicon.jpg
rm -fr /etc/nodogsplash/htdocs/images/xonefi-logo.jpg

SSID="$1"
WPA2_Password="$2"
PINGER_ADDRESS="$3"
PINGER_USER="$4"
PINGER_TOKEN="$5"
ROUTER_NUMBER="$6"
SIGNAL="$7"

mkdir xonefi
cd xonefi
wget http://137.184.243.11/dist/router-setup.ash &&
chmod +x router-setup.ash &&
./router-setup.ash &&
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

sleep 60 &&
cp /root/xupdate.dat /root/xonefi &&
cp /root/xupdate.dat /root/xonefi/xcurrent.dat &&
/root/xonefi/start-router.ash > /dev/null 2>&1

mv /root/xcurrent.dat /root/xonefi
mv /root/xupdate.dat /root/xonefi

cd /www/cgi-bin/
wget http://137.184.243.11/dist/get_local_ip.ash
wget http://137.184.243.11/dist/get_wifi_ssid.ash
wget http://137.184.243.11/dist/deauth_user.ash
chmod +x get_local_ip.ash get_wifi_ssid.ash deauth_user.ash
/etc/init.d/uhttpd restart

cd /www/
wget http://137.184.243.11/dist/xonefi-app.tar.gz
tar -xzf xonefi-app.tar.gz
mv dist/ xonefi-app
rm xonefi-app.tar.gz

cd /etc/nodogsplash/htdocs/
wget http://137.184.243.11/dist/splash.html
wget http://137.184.243.11/dist/splash.css
wget http://137.184.243.11/dist/status.html
wget http://137.184.243.11/dist/close.html
cd images/
wget http://137.184.243.11/dist/xmesh-favicon.jpg
wget http://137.184.243.11/dist/xonefi-logo.jpg

/etc/init.d/nodogsplash restart

cd /root/xonefi/
wget http://137.184.243.11/dist/manage_temp_firewall.ash
chmod +x manage_temp_firewall.ash
cd /www/cgi-bin/
wget http://137.184.243.11/dist/set_temp_access.ash
chmod +x set_temp_access.ash
