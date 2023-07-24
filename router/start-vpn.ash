#!/bin/ash

opkg update

# Install required packages
opkg install wireguard-tools luci-proto-wireguard curl

echo "packages installed, starting wireguard setup..."

# Load WireGuard kernel module
modprobe wireguard

# Enable WireGuard service
# /etc/init.d/network restart

# Generate WireGuard key pair
private_key=$(wg genkey)
public_key=$(echo "$private_key" | wg pubkey)

mullvad_ip=$(curl -s -d "account=0129241754650412" --data-urlencode "pubkey=$public_key" https://api.mullvad.net/wg/)

address=$(echo "$mullvad_ip" | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}')

# Create WireGuard interface
uci set network.WGINTERFACE=interface
uci set network.WGINTERFACE.proto='wireguard'
uci set network.WGINTERFACE.private_key=$private_key
uci set network.WGINTERFACE.addresses=$address
uci set network.WGINTERFACE.force_link='1'

# Add WireGuard peer configuration 
uci add network wireguard_WGINTERFACE
uci set network.@wireguard_WGINTERFACE[0]=wireguard_WGINTERFACE
uci set network.@wireguard_WGINTERFACE[0].public_key='k4ah0qvHgn5IsalvehE7GPiDC4BOE9botvd+KITdtyg='
uci set network.@wireguard_WGINTERFACE[0].allowed_ips='0.0.0.0/0'
uci set network.@wireguard_WGINTERFACE[0].route_allowed_ips='1'
uci set network.@wireguard_WGINTERFACE[0].endpoint_host='199.229.250.59'
uci set network.@wireguard_WGINTERFACE[0].endpoint_port='51820'

uci add firewall zone
uci set firewall.@zone[-1].name='WGZONE'
uci set firewall.@zone[-1].input='REJECT'
uci set firewall.@zone[-1].output='ACCEPT'
uci set firewall.@zone[-1].forward='REJECT'
uci set firewall.@zone[-1].masq='1'
uci set firewall.@zone[-1].mtu_fix='1'
uci set firewall.@zone[-1].network='WGINTERFACE'

uci add firewall forwarding
uci set firewall.@forwarding[-1].src='lan'
uci set firewall.@forwarding[-1].dest='WGZONE'


# Commit changes
uci commit network
uci commit firewall

uci set network.lan.ipaddr='192.168.99.1'

uci set dhcp.lan.dhcp_option='6,10.64.0.1'

uci set firewall.@zone[1].forward='WGZONE:WGINTERFACE'
uci commit firewall

echo "finished setup"
echo "Private Key: $private_key"
echo "Public Key: $public_key"
echo "Mullvad IP: $mullvad_ip"


# Restart network service
/etc/init.d/network restart

# Restart firewall service
/etc/init.d/firewall restart

echo "WireGuard keys generated and interface configured:"
echo "Private Key: $private_key"
echo "Public Key: $public_key"
echo "Mullvad IP: $mullvad_ip"