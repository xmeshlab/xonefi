#!/bin/bash
touch ~/.onefi-provider.pid
echo "==== PROVIDER START ====" >> ~/.onefi.log
./stop-provider.sh

rm -fr /var/www/html/*

mkdir /var/www/html/d1feb8d074/
chmod 755 /var/www/html/d1feb8d074/

mkdir /var/www/html/d1feb8d074/3141
chmod 755 /var/www/html/d1feb8d074/3141
echo -n "0" > /var/www/html/d1feb8d074/3141/update.dat
echo -n "0" > /var/www/html/d1feb8d074/3141/xupdate.dat
echo -n "0" > /var/www/html/d1feb8d074/3141/ssid.dat
touch /var/www/html/d1feb8d074/3141/policy.fw
chmod 755 /var/www/html/d1feb8d074/3141/policy.fw
touch /var/www/html/d1feb8d074/3141/wpolicy.fw
touch /var/www/html/d1feb8d074/3141/ssid.fw
chmod 755 /var/www/html/d1feb8d074/3141/wpolicy.fw
chmod 755 /var/www/html/d1feb8d074/3141/ssid.fw
touch /var/www/html/d1feb8d074/3141/inject.ash
chmod 755 /var/www/html/d1feb8d074/3141/inject.ash

mkdir /var/www/html/d1feb8d074/3142
chmod 755 /var/www/html/d1feb8d074/3142
echo -n "0" > /var/www/html/d1feb8d074/3142/update.dat
echo -n "0" > /var/www/html/d1feb8d074/3142/xupdate.dat
echo -n "0" > /var/www/html/d1feb8d074/3142/ssid.dat
touch /var/www/html/d1feb8d074/3142/policy.fw
chmod 755 /var/www/html/d1feb8d074/3142/policy.fw
touch /var/www/html/d1feb8d074/3142/wpolicy.fw
touch /var/www/html/d1feb8d074/3142/ssid.fw
chmod 755 /var/www/html/d1feb8d074/3142/wpolicy.fw
chmod 755 /var/www/html/d1feb8d074/3142/ssid.fw
touch /var/www/html/d1feb8d074/3142/inject.ash
chmod 755 /var/www/html/d1feb8d074/3142/inject.ash

mkdir /var/www/html/d1feb8d074/3143
chmod 755 /var/www/html/d1feb8d074/3143
echo -n "0" > /var/www/html/d1feb8d074/3143/update.dat
echo -n "0" > /var/www/html/d1feb8d074/3143/xupdate.dat
echo -n "0" > /var/www/html/d1feb8d074/3143/ssid.dat
touch /var/www/html/d1feb8d074/3143/policy.fw
chmod 755 /var/www/html/d1feb8d074/3143/policy.fw
touch /var/www/html/d1feb8d074/3143/wpolicy.fw
touch /var/www/html/d1feb8d074/3143/ssid.fw
chmod 755 /var/www/html/d1feb8d074/3143/wpolicy.fw
chmod 755 /var/www/html/d1feb8d074/3143/ssid.fw
touch /var/www/html/d1feb8d074/3143/inject.ash
chmod 755 /var/www/html/d1feb8d074/3143/inject.ash

mkdir /var/www/html/d1feb8d074/3144
chmod 755 /var/www/html/d1feb8d074/3144
echo -n "0" > /var/www/html/d1feb8d074/3144/update.dat
echo -n "0" > /var/www/html/d1feb8d074/3144/xupdate.dat
echo -n "0" > /var/www/html/d1feb8d074/3144/ssid.dat
touch /var/www/html/d1feb8d074/3144/policy.fw
chmod 755 /var/www/html/d1feb8d074/3144/policy.fw
touch /var/www/html/d1feb8d074/3144/wpolicy.fw
touch /var/www/html/d1feb8d074/3144/ssid.fw
chmod 755 /var/www/html/d1feb8d074/3144/wpolicy.fw
chmod 755 /var/www/html/d1feb8d074/3144/ssid.fw
touch /var/www/html/d1feb8d074/3144/inject.ash
chmod 755 /var/www/html/d1feb8d074/3144/inject.ash

mkdir /var/www/html/497d9fa8d0/
chmod 755 /var/www/html/497d9fa8d0/

mkdir /var/www/html/497d9fa8d0/1000
chmod 755 /var/www/html/497d9fa8d0/1000
echo -n "0" > /var/www/html/497d9fa8d0/1000/update.dat
echo -n "0" > /var/www/html/497d9fa8d0/1000/xupdate.dat
echo -n "0" > /var/www/html/497d9fa8d0/1000/ssid.dat
touch /var/www/html/497d9fa8d0/1000/policy.fw
touch /var/www/html/497d9fa8d0/1000/wpolicy.fw
touch /var/www/html/497d9fa8d0/1000/ssid.fw
chmod 755 /var/www/html/497d9fa8d0/1000/policy.fw
chmod 755 /var/www/html/497d9fa8d0/1000/wpolicy.fw
chmod 755 /var/www/html/497d9fa8d0/1000/ssid.fw
touch /var/www/html/497d9fa8d0/1000/inject.ash
chmod 755 /var/www/html/497d9fa8d0/1000/inject.ash

mkdir /var/www/html/497d9fa8d0/1001
chmod 755 /var/www/html/497d9fa8d0/1001
echo -n "0" > /var/www/html/497d9fa8d0/1001/update.dat
echo -n "0" > /var/www/html/497d9fa8d0/1001/xupdate.dat
echo -n "0" > /var/www/html/497d9fa8d0/1001/ssid.dat
touch /var/www/html/497d9fa8d0/1001/policy.fw
touch /var/www/html/497d9fa8d0/1001/wpolicy.fw
touch /var/www/html/497d9fa8d0/1001/ssid.fw
chmod 755 /var/www/html/497d9fa8d0/1001/policy.fw
chmod 755 /var/www/html/497d9fa8d0/1001/wpolicy.fw
chmod 755 /var/www/html/497d9fa8d0/1001/ssid.fw
touch /var/www/html/497d9fa8d0/1001/inject.ash
chmod 755 /var/www/html/497d9fa8d0/1001/inject.ash

cp /var/www/index.html /var/www/html/

mkdir /var/www/html/dist
cp ../router/puller.ash /var/www/html/dist
cp ../router/router-setup.ash /var/www/html/dist
cp ../router/start-router.ash /var/www/html/dist
cp ../router/stop-router.ash /var/www/html/dist
cp ../router/init.ash /var/www/html/dist
cp ../router/firewall.orig /var/www/html/dist
cp ../router/firewall-blocker.orig /var/www/html/dist
cp ../router/xpuller.ash /var/www/html/dist
cp ../router/spuller.ash /var/www/html/dist
cp ../router/daemon.sh /var/www/html/dist
cp ../router/configure.ash /var/www/html/dist
cp ../router/start-vpn.ash /var/www/html/dist
cp ../router/stop-vpn.ash /var/www/html/dist
cp ../router/collect-file.ash /var/www/html/dist
cp ../router/update-router.ash /var/www/html/dist
cp ../router/roll-log.ash /var/www/html/dist
cp ../router/get_local_ip.ash /var/www/html/dist
cp ../router/get_wifi_ssid.ash /var/www/html/dist
cp /root/xonefi-web/xonefi-app.tar.gz /var/www/html/dist
cp ../router/splash.html /var/www/html/dist
cp ../router/splash.css /var/www/html/dist
cp ../router/status.html /var/www/html/dist
cp ../router/xmesh-favicon.jpg /var/www/html/dist
cp ../router/xonefi-logo.jpg /var/www/html/dist
cp ../router/manage_temp_firewall.ash /var/www/html/dist
cp ../router/set_temp_access.ash /var/www/html/dist
cp /home/collector/id_new /var/www/html/dist

mkdir /var/www/html/quickservice
cp ../webforms/ipwhitelist.html /var/www/html/quickservice

chmod 755 /var/www/html/dist/
chmod 755 /var/www/html/dist/router-setup.ash
chmod 755 /var/www/html/dist/start-router.ash
chmod 755 /var/www/html/dist/stop-router.ash
chmod 755 /var/www/html/dist/init.ash
chmod 755 /var/www/html/dist/puller.ash
chmod 755 /var/www/html/dist/firewall.orig
chmod 755 /var/www/html/dist/firewall-blocker.orig
chmod 755 /var/www/html/dist/xpuller.ash
chmod 755 /var/www/html/dist/spuller.ash
chmod 755 /var/www/html/dist/daemon.sh
chmod 755 /var/www/html/dist/configure.ash
chmod 755 /var/www/html/dist/start-vpn.ash
chmod 755 /var/www/html/dist/stop-vpn.ash
chmod 755 /var/www/html/dist/collect-file.ash
chmod 755 /var/www/html/dist/update-router.ash
chmod 755 /var/www/html/dist/roll-log.ash
chmod 755 /var/www/html/dist/get_local_ip.ash
chmod 755 /var/www/html/dist/get_wifi_ssid.ash
chmod 775 /var/www/html/dist/manage_temp_firewall.ash
chmod 775 /var/www/html/dist/set_temp_access.ash
chmod 755 /var/www/html/dist/id_new
chmod 755 /var/www/html/quickservice/ipwhitelist.html

nohup node provider.js 'seitlab123!@' >> ~/.onefi.log 2>&1 &
