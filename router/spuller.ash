#!/bin/ash

SLEEP_SEC=120
PINGER_ADDRESS=
PROTOCOL=http
PINGER_USER=
PINGER_TOKEN=
ROUTER_NUMBER=
LOG_FILE=/root/sonefix.log


while true; do
  if [ -f "/root/xonefi/ssid.dat" ]; then
      rm -f /root/xonefi/scurrent.dat
      mv /root/xonefi/ssid.dat /root/xonefi/scurrent.dat
  else
      echo -n "0" > /root/xonefi/scurrent.dat
      rm -f /root/xonefi/ssid.fw
      touch /root/xonefi/ssid.fw
  fi

  wget -q --user=$PINGER_USER --password=$PINGER_TOKEN $PROTOCOL://$PINGER_ADDRESS/$PINGER_USER/$ROUTER_NUMBER/ssid.dat -O /root/xonefi/ssid.dat
  content=$(cat "/root/xonefi/ssid.dat")
  ccontent=$(cat "/root/xonefi/scurrent.dat")
  echo -n "ssid.dat content: " >> $LOG_FILE
  echo "$content" >> $LOG_FILE

  if [ "$content" = "0" ] && [ "$ccontent" != "0" ]; then
      rm -f /root/xonefi/scurrent.dat
      echo -n "0" > /root/xonefi/scurrent.dat
      rm -f /root/xonefi/ssid.fw
      touch /root/xonefi/ssid.fw
      #ash root/xonefi/ssid.fw >> $LOG_FILE
  fi

  if cmp -s "/root/xonefi/ssid.dat" "/root/xonefi/scurrent.dat"; then
    echo "Stay put." >> $LOG_FILE
  else
    echo "Pull and execute injection." >> $LOG_FILE
    rm -f /root/xonefi/ssid.fw
    wget -q --user=$PINGER_USER --password=$PINGER_TOKEN $PROTOCOL://$PINGER_ADDRESS/$PINGER_USER/$ROUTER_NUMBER/ssid.fw -O /root/xonefi/ssid.fw
    #ash /root/xonefi/ssid.fw
  fi

  sleep $SLEEP_SEC
done