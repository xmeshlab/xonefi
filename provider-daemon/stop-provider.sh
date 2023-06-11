#!/bin/bash
echo "==== PROVIDER STOP ====" >> ~/.onefi.log
kill -n 9 `cat ~/.onefi-provider.pid`
