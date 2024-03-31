#!/bin/ash

echo "==== XONEFI ROUTER START ====" >> /root/xonefi.log
echo "==== XONEFI ROUTER START ====" >> /root/xonefix.log
echo "==== XONEFI ROUTER START ====" >> /root/xonefis.log

(crontab -l 2>/dev/null; echo "@reboot /bin/ash /root/xonefi/roll-log.ash") | crontab -
(crontab -l 2>/dev/null; echo "0 0 * * * /bin/ash /root/xonefi/roll-log.ash") | crontab -

/root/xonefi/stop-router.ash
nohup /root/xonefi/puller.ash &
nohup /root/xonefi/xpuller.ash &
nohup /root/xonefi/spuller.ash &
