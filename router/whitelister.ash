#!/bin/ash

SLEEP_SEC=10
PINGER_ADDRESS=
PROTOCOL=http
PINGER_USER=
PINGER_TOKEN=
ROUTER_NUMBER=
LOG_FILE=/root/whitelister.log

while true; do
  if [ -f "/root/xonefi/wupdate.dat" ]; then
      rm -f /root/xonefi/wcurrent.dat
      mv /root/xonefi/wupdate.dat /root/xonefi/wcurrent.dat
  else
      echo -n "0" > /root/xonefi/wcurrent.dat
      rm -f /root/xonefi/wpolicy.fw
      echo "# Empty whitelist" > /root/xonefi/wpolicy.fw
      cat /root/xonefi/firewall.orig /root/xonefi/policy.fw /root/xonefi/firewall-blocker.orig > /etc/config/firewall
      /etc/init.d/firewall restart
  fi

  wget -q --user=$PINGER_USER --password=$PINGER_TOKEN $PROTOCOL://$PINGER_ADDRESS/$PINGER_USER/$ROUTER_NUMBER/wupdate.dat -O /root/xonefi/wupdate.dat
  content=$(cat "/root/xonefi/wupdate.dat")
  ccontent=$(cat "/root/xonefi/wcurrent.dat")
  echo -n "wupdate.dat content: " >> $LOG_FILE
  echo "$content" >> $LOG_FILE

  if [ "$content" = "0" ] && ["$ccontent" != "0"]; then
      rm -f /root/xonefi/wcurrent.dat
      echo -n "0" > /root/xonefi/wcurrent.dat
      rm -f /root/xonefi/policy.fw
      echo "# Empty policy" > /root/xonefi/policy.fw
      cat /root/xonefi/firewall.orig /root/xonefi/policy.fw /root/xonefi/firewall-blocker.orig > /etc/config/firewall
      /etc/init.d/firewall restart
  fi

  if cmp -s "/root/xonefi/wupdate.dat" "/root/xonefi/wcurrent.dat"; then
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