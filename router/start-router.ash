#!/bin/ash

echo "==== XONEFI ROUTER START ====" >> /root/xonefi.log
echo "==== XONEFI ROUTER START ====" >> /root/xonefix.log

/root/xonefi/stop-router.ash
nohup /root/xonefi/puller.ash &
nohup /root/xonefi/xpuller.ash &