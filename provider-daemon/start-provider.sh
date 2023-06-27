#!/bin/bash
touch ~/.onefi-provider.pid
echo "==== PROVIDER START ====" >> ~/.onefi.log
./stop-provider.sh

rm -fr /var/www/html/*

mkdir /var/www/html/d1feb8d074/
mkdir /var/www/html/d1feb8d074/3141
chmod 755 /var/www/html/d1feb8d074/
chmod 755 /var/www/html/d1feb8d074/3141
echo -n "0" > /var/www/html/d1feb8d074/3141/update.dat
touch /var/www/html/d1feb8d074/3141/policy.fw
chmod 755 /var/www/html/d1feb8d074/3141/policy.fw

cp /var/www/index.html /var/www/html/

nohup node provider.js 'seitlab123!@' >> ~/.onefi.log 2>&1 &


