#!/bin/ash
echo "Content-type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""
echo "{ \"ip\": \"$REMOTE_ADDR\" }"