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
touch /var/www/html/d1feb8d074/3141/policy.fw
chmod 755 /var/www/html/d1feb8d074/3141/policy.fw

mkdir /var/www/html/d1feb8d074/3142
chmod 755 /var/www/html/d1feb8d074/3142
echo -n "0" > /var/www/html/d1feb8d074/3142/update.dat
touch /var/www/html/d1feb8d074/3142/policy.fw
chmod 755 /var/www/html/d1feb8d074/3142/policy.fw

mkdir /var/www/html/d1feb8d074/3143
chmod 755 /var/www/html/d1feb8d074/3143
echo -n "0" > /var/www/html/d1feb8d074/3143/update.dat
touch /var/www/html/d1feb8d074/3143/policy.fw
chmod 755 /var/www/html/d1feb8d074/3143/policy.fw

mkdir /var/www/html/d1feb8d074/3144
chmod 755 /var/www/html/d1feb8d074/3144
echo -n "0" > /var/www/html/d1feb8d074/3144/update.dat
touch /var/www/html/d1feb8d074/3144/policy.fw
chmod 755 /var/www/html/d1feb8d074/3144/policy.fw

cp /var/www/index.html /var/www/html/

mkdir /var/www/html/dist
cp ../router/puller.ash /var/www/html/dist
cp ../router/router-setup.ash /var/www/html/dist
cp ../router/start-router.ash /var/www/html/dist
cp ../router/stop-router.ash /var/www/html/dist
cp ../router/init.ash /var/www/html/dist
cp ../router/firewall.orig /var/www/html/dist

chmod 755 /var/www/html/dist/
chmod 755 /var/www/html/dist/router-setup.ash
chmod 755 /var/www/html/dist/start-router.ash
chmod 755 /var/www/html/dist/stop-router.ash
chmod 755 /var/www/html/dist/init.ash
chmod 755 /var/www/html/dist/puller.ash
chmod 755 /var/www/html/dist/firewall.orig

nohup node provider.js 'seitlab123!@' >> ~/.onefi.log 2>&1 &


