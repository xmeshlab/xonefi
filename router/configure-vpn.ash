#!/bin/ash

info_file="wireguard_setup_info.txt"
private_key_file="private_key.txt"
public_key_file="public_key.txt"

opkg update

# Install required packages
opkg install wireguard-tools luci-proto-wireguard curl

echo "Packages installed, starting WireGuard setup..."

# Load WireGuard kernel module
modprobe wireguard

# Generate WireGuard key pair
private_key=$(wg genkey)
public_key=$(echo "$private_key" | wg pubkey)

mullvad_ip=$(curl -s -d "account=0129241754650412" --data-urlencode "pubkey=$public_key" https://api.mullvad.net/wg/)

address=$(echo "$mullvad_ip" | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}')

# Save information to files
echo "Mullvad IP: $mullvad_ip" > "$info_file"
echo "Address: $address" >> "$info_file"
echo "$public_key" > "$public_key_file"
echo "$private_key" > "$private_key_file"

echo "WireGuard setup information saved to $info_file"
echo "Public key saved to $public_key_file"
echo "Private key saved to $private_key_file"
