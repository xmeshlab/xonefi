#!/bin/bash
echo "==== PROVIDER STOP ====" >> ~/.onefi.log
kill -9 `cat ~/.onefi-provider.pid`
