#!/bin/bash

echo "Stopping WireGuard VPN..."

# Delete the WireGuard interface and peer configuration
uci -q delete network.WGINTERFACE
uci -q delete network.wireguard_WGINTERFACE

# Check if 'WGZONE' exists in the firewall configuration and delete it
if uci -q get firewall.WGZONE >/dev/null; then
  uci -q delete firewall.WGZONE
fi

# Check if there's a forwarding rule from lan to WGZONE and delete it
if uci -q get firewall.@forwarding[-1].src='lan' >/dev/null; then
  uci -q delete firewall.@forwarding[-1]
fi

# Remove DHCP-Options for the lan interface
uci -q delete dhcp.lan.dhcp_option

# Remove DNS forwarding to 10.64.0.1
uci -q delete dhcp.@dnsmasq[0].server

# Restore the original firewall configuration from firewall.orig
cat firewall.orig > /etc/config/firewall

# Commit changes
uci commit network
uci commit firewall
uci commit dhcp

# Restart network service
/etc/init.d/network restart

# Restart firewall service
/etc/init.d/firewall restart
/etc/init.d/dnsmasq restart

echo "WireGuard VPN stopped. You now have normal internet access."