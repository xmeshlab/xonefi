#!/bin/ash
echo "==== XONEFI ROUTER STOP ====" >> /root/xonefi.log
echo "==== XONEFI ROUTER STOP ====" >> /root/xonefix.log
pkill -9 -f puller.ash
pkill -9 -f xpuller.ash