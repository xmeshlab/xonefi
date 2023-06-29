#!/bin/ash

echo "==== XONEFI ROUTER START ====" >> ~/.xonefi.log
./stop-router.ash

nohup ./puller.ash >> ~/.xonefi.log 2>&1 &
