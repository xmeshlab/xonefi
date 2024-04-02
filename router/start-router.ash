#!/bin/ash

echo "==== XONEFI ROUTER START ====" >> /root/xonefi.log
echo "==== XONEFI ROUTER START ====" >> /root/xonefix.log
echo "==== XONEFI ROUTER START ====" >> /root/xonefis.log

/root/xonefi/stop-router.ash

sleep 10

nohup /root/xonefi/puller.ash &
nohup /root/xonefi/xpuller.ash &
nohup /root/xonefi/spuller.ash &
