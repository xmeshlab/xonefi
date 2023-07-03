#!/bin/ash

SLEEP_SEC=10
PINGER_ADDRESS=
PROTOCOL=http
PINGER_USER=
PINGER_TOKEN=
ROUTER_NUMBER=

while true; do
  if [ -f "update.dat" ]; then
      rm -f current.dat
      mv update.dat current.dat
  else
      echo -n "0" > current.dat
      rm -f policy.fw
      echo "# Empty policy" > policy.fw
      cat firewall.orig policy.fw > /etc/config/firewall
      /etc/init.d/firewall restart
  fi

  wget -q --user=$PINGER_USER --password=$PINGER_TOKEN $PROTOCOL://$PINGER_ADDRESS/$PINGER_USER/$ROUTER_NUMBER/update.dat
  content=$(cat "update.dat")
  echo -n "update.dat content: "
  echo "$content"

  if [ "$content" = "0" ]; then
      rm -f current.dat
      echo -n "0" > current.dat
      rm -f policy.fw
      echo "# Empty policy" > policy.fw
      cat firewall.orig policy.fw > /etc/config/firewall
      /etc/init.d/firewall restart
  fi

  if cmp -s "update.dat" "current.dat"; then
    echo "Stay put."
  else
    echo "Pull and execute new policy."
    rm -f policy.fw
    wget -q --user=$PINGER_USER --password=$PINGER_TOKEN $PROTOCOL://$PINGER_ADDRESS/$PINGER_USER/$ROUTER_NUMBER/policy.fw
    cat firewall.orig policy.fw > /etc/config/firewall
    /etc/init.d/firewall restart
  fi

  sleep $SLEEP_SEC
done
