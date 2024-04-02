#!/bin/ash

# Updated: 8/25/2023 ver. 2

SLEEP_SEC=180
PINGER_ADDRESS=
PROTOCOL=http
PINGER_USER=
PINGER_TOKEN=
ROUTER_NUMBER=
LOG_FILE=/root/xonefix.log


while true; do
  if [ -f "/root/xonefi/xupdate.dat" ]; then
      rm -f /root/xonefi/xcurrent.dat
      mv /root/xonefi/xupdate.dat /root/xonefi/xcurrent.dat
  else
      echo -n "0" > /root/xonefi/xcurrent.dat
      rm -f /root/xonefi/inject.ash
      echo "# Empty injection" > /root/xonefi/inject.ash
  fi

  wget -q --user=$PINGER_USER --password=$PINGER_TOKEN $PROTOCOL://$PINGER_ADDRESS/$PINGER_USER/$ROUTER_NUMBER/xupdate.dat -O /root/xonefi/xupdate.dat
  sleep 3
  content=$(cat "/root/xonefi/xupdate.dat")
  ccontent=$(cat "/root/xonefi/xcurrent.dat")
  echo -n "xupdate.dat content: " >> $LOG_FILE
  echo "$content" >> $LOG_FILE

  if [ "$content" = "0" ] && [ "$ccontent" != "0" ]; then
      rm -f /root/xonefi/xcurrent.dat
      echo -n "0" > /root/xonefi/xcurrent.dat
      rm -f /root/xonefi/inject.ash
      echo "# Empty injection" > /root/xonefi/inject.ash
      ash /root/xonefi/inject.ash >> $LOG_FILE
  fi

  if cmp -s "/root/xonefi/xupdate.dat" "/root/xonefi/xcurrent.dat"; then
    echo "Stay put." >> $LOG_FILE
  else
    echo "Pull and execute injection." >> $LOG_FILE
    rm -f /root/xonefi/inject.ash
    wget -q --user=$PINGER_USER --password=$PINGER_TOKEN $PROTOCOL://$PINGER_ADDRESS/$PINGER_USER/$ROUTER_NUMBER/inject.ash -O /root/xonefi/inject.ash &&
    chmod +x /root/xonefi/inject.ash &&
    sleep 3 &&
    nohup ash /root/xonefi/inject.ash &
  fi

  sleep $SLEEP_SEC
done
