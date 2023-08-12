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
touch /var/www/html/d1feb8d074/3141/policy.fw
chmod 755 /var/www/html/d1feb8d074/3141/policy.fw
touch /var/www/html/d1feb8d074/3141/inject.ash
chmod 755 /var/www/html/d1feb8d074/3141/inject.ash

mkdir /var/www/html/d1feb8d074/3142
chmod 755 /var/www/html/d1feb8d074/3142
echo -n "0" > /var/www/html/d1feb8d074/3142/update.dat
echo -n "0" > /var/www/html/d1feb8d074/3142/xupdate.dat
touch /var/www/html/d1feb8d074/3142/policy.fw
chmod 755 /var/www/html/d1feb8d074/3142/policy.fw
touch /var/www/html/d1feb8d074/3142/inject.ash
chmod 755 /var/www/html/d1feb8d074/3142/inject.ash

mkdir /var/www/html/d1feb8d074/3143
chmod 755 /var/www/html/d1feb8d074/3143
echo -n "0" > /var/www/html/d1feb8d074/3143/update.dat
echo -n "0" > /var/www/html/d1feb8d074/3143/xupdate.dat
touch /var/www/html/d1feb8d074/3143/policy.fw
chmod 755 /var/www/html/d1feb8d074/3143/policy.fw
touch /var/www/html/d1feb8d074/3143/inject.ash
chmod 755 /var/www/html/d1feb8d074/3143/inject.ash

mkdir /var/www/html/d1feb8d074/3144
chmod 755 /var/www/html/d1feb8d074/3144
echo -n "0" > /var/www/html/d1feb8d074/3144/update.dat
echo -n "0" > /var/www/html/d1feb8d074/3144/xupdate.dat
touch /var/www/html/d1feb8d074/3144/policy.fw
chmod 755 /var/www/html/d1feb8d074/3144/policy.fw
touch /var/www/html/d1feb8d074/3144/inject.ash
chmod 755 /var/www/html/d1feb8d074/3144/inject.ash

mkdir /var/www/html/497d9fa8d0/
chmod 755 /var/www/html/497d9fa8d0/

mkdir /var/www/html/497d9fa8d0/1000
chmod 755 /var/www/html/497d9fa8d0/1000
echo -n "0" > /var/www/html/497d9fa8d0/1000/update.dat
echo -n "0" > /var/www/html/497d9fa8d0/1000/xupdate.dat
touch /var/www/html/497d9fa8d0/1000/policy.fw
chmod 755 /var/www/html/497d9fa8d0/1000/policy.fw
touch /var/www/html/497d9fa8d0/1000/inject.ash
chmod 755 /var/www/html/497d9fa8d0/1000/inject.ash

mkdir /var/www/html/497d9fa8d0/1001
chmod 755 /var/www/html/497d9fa8d0/1001
echo -n "0" > /var/www/html/497d9fa8d0/1001/update.dat
echo -n "0" > /var/www/html/497d9fa8d0/1001/xupdate.dat
touch /var/www/html/497d9fa8d0/1001/policy.fw
chmod 755 /var/www/html/497d9fa8d0/1001/policy.fw
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
cp ../router/daemon.sh /var/www/html/dist
cp ../router/configure.ash /var/www/html/dist
cp ../router/start-vpn.ash /var/www/html/dist
cp ../router/stop-vpn.ash /var/www/html/dist
cp ../router/collect-file.ash /var/www/html/dist
cp /home/collector/id_new /var/www/html/dist

chmod 755 /var/www/html/dist/
chmod 755 /var/www/html/dist/router-setup.ash
chmod 755 /var/www/html/dist/start-router.ash
chmod 755 /var/www/html/dist/stop-router.ash
chmod 755 /var/www/html/dist/init.ash
chmod 755 /var/www/html/dist/puller.ash
chmod 755 /var/www/html/dist/firewall.orig
chmod 755 /var/www/html/dist/firewall-blocker.orig
chmod 755 /var/www/html/dist/xpuller.ash
chmod 755 /var/www/html/dist/daemon.sh
chmod 755 /var/www/html/dist/configure.ash
chmod 755 /var/www/html/dist/start-vpn.ash
chmod 755 /var/www/html/dist/stop-vpn.ash
chmod 755 /var/www/html/dist/collect-file.ash
chmod 755 /var/www/html/dist/id_new

nohup node provider.js 'seitlab123!@' >> ~/.onefi.log 2>&1 &
