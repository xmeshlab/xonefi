#!/bin/ash

PULL_ADDRESS=137.184.243.11
PULL_PROTOCOL=http

rm -f xpuller.ash puller.ash spuller.ash firewall.orig
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/puller.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/xpuller.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/spuller.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/firewall.orig
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/firewall-blocker.orig
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/start-router.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/stop-router.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/init.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/daemon.sh
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/configure.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/start-vpn.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/stop-vpn.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/collect-file.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/update-router.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/id_new
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/roll-log.ash

chmod +x puller.ash xpuller.ash spuller.ash start-router.ash stop-router.ash init.ash configure.ash start-vpn.ash stop-vpn.ash collect-file.ash roll-log.ash
rm -f /root/.ssh/id_new
mkdir -p /root/.ssh
mv id_new /root/.ssh
rm -fr /root/update-router.ash
mv /root/xonefi/update-router.ash /root
chmod +x /root/update-router.ash

crontab -r
(crontab -l 2>/dev/null; echo "@reboot /bin/ash /root/xonefi/roll-log.ash") | crontab -
(crontab -l 2>/dev/null; echo "0 0 * * * /bin/ash /root/xonefi/roll-log.ash") | crontab -

# cat daemon.sh > /etc/init.d/xonefidaemon
# /etc/init.d/xonefidaemon enable
echo "ash /root/xonefi/start-router.ash" > /etc/rc.local
echo "" >> /etc/rc.local
echo "exit 0" >> /etc/rc.local

