#!/bin/ash

PULL_ADDRESS=137.184.213.75
PULL_PROTOCOL=http

rm -f puller.ash firewall.orig
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/puller.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/firewall.orig
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/start-router.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/stop-router.ash
wget $PULL_PROTOCOL://$PULL_ADDRESS/dist/init.ash

chmod +x puller.ash start-router.ash stop-router.ash init.ash
