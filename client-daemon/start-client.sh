#!/bin/bash
touch ~/.onefi-client.pid
./stop-client.sh
sleep 1
echo "==== CLIENT START ====" >> ~/.onefi.log
nohup node client seitlab123!@ >> ~/.onefi.log 2>&1 &
