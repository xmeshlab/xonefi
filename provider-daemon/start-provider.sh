#!/bin/bash
touch ~/.onefi-provider.pid
echo "==== PROVIDER START ====" >> ~/.onefi.log
./stop-provider.sh
nohup node provider.js 'seitlab123!@' >> ~/.onefi.log 2>&1 &
