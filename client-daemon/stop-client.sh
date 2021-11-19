#!/bin/bash
echo "==== CLIENT STOP ====" >> ~/.onefi.log
kill -9 `cat ~/.onefi-client.pid`