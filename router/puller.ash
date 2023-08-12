#!/bin/ash

SLEEP_SEC=10
PINGER_ADDRESS=
PROTOCOL=http
PINGER_USER=
PINGER_TOKEN=
ROUTER_NUMBER=
LOG_FILE=/root/xonefi.log
LOG_CAP=100

roll_log() {
  log_size=$(wc -c < "$LOG_FILE")
  if [ "$log_size" -gt "$LOG_CAP" ]; then
    tail -c "$LOG_CAP" "$LOG_FILE" > "$LOG_FILE.temp"
    mv "$LOG_FILE.temp" "$LOG_FILE"
  fi
}


while true; do

  roll_log
  
  if [ -f "update.dat" ]; then
      rm -f current.dat
      mv update.dat current.dat
      
  if [ -f "/root/xonefi/update.dat" ]; then
      rm -f /root/xonefi/current.dat
      mv /root/xonefi/update.dat /root/xonefi/current.dat

  else
      echo -n "0" > /root/xonefi/current.dat
      rm -f /root/xonefi/policy.fw
      echo "# Empty policy" > /root/xonefi/policy.fw
      cat /root/xonefi/firewall.orig /root/xonefi/policy.fw /root/xonefi/firewall-blocker.orig > /etc/config/firewall
      /etc/init.d/firewall restart
  fi

  wget -q --user=$PINGER_USER --password=$PINGER_TOKEN $PROTOCOL://$PINGER_ADDRESS/$PINGER_USER/$ROUTER_NUMBER/update.dat -O /root/xonefi/update.dat
  content=$(cat "/root/xonefi/update.dat")
  ccontent=$(cat "/root/xonefi/current.dat")
  echo -n "update.dat content: " >> $LOG_FILE
  echo "$content" >> $LOG_FILE

  if [ "$content" = "0" ] && ["$ccontent" != "0"]; then
      rm -f /root/xonefi/current.dat
      echo -n "0" > /root/xonefi/current.dat
      rm -f /root/xonefi/policy.fw
      echo "# Empty policy" > /root/xonefi/policy.fw
      cat /root/xonefi/firewall.orig /root/xonefi/policy.fw /root/xonefi/firewall-blocker.orig > /etc/config/firewall
      /etc/init.d/firewall restart
  fi

  if cmp -s "/root/xonefi/update.dat" "/root/xonefi/current.dat"; then
    echo "Stay put." >> $LOG_FILE
  else
    echo "Pull and execute new policy." >> $LOG_FILE
    rm -f /root/xonefi/policy.fw
    wget -q --user=$PINGER_USER --password=$PINGER_TOKEN $PROTOCOL://$PINGER_ADDRESS/$PINGER_USER/$ROUTER_NUMBER/policy.fw -O /root/xonefi/policy.fw
    cat /root/xonefi/firewall.orig /root/xonefi/policy.fw /root/xonefi/firewall-blocker.orig > /etc/config/firewall
    /etc/init.d/firewall restart
  fi

  sleep $SLEEP_SEC
done