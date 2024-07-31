the firewall configurations should be set after Nodogsplash is set up to override the default nodogsplash firewall rules.

# Router Setup

1. Install Dependencies:
   ```sh
   opkg update
   opkg install iwinfo nodogsplash
   ```
1. Copy Necessary scripts:
   ```sh
   cd /www/cgi-bin/
   wget https://raw.githubusercontent.com/xmeshlab/xonefi/master/router/get_local_ip.ash
   wget https://raw.githubusercontent.com/xmeshlab/xonefi/master/router/get_wifi_ssid.ash
   chmod +x get_local_ip.ash get_wifi_ssid.ash
   ```
1. Restart `uhttpd` Service:
   ```sh
   /etc/init.d/uhttpd restart
   ```

# Web App Setup

4. Build Web App:
   On your local machine, in the xonefi-web project directory, run:
   ```sh
   npm run build
   ```
1. Deploy Web App:
   ```sh
   ssh root@192.168.1.1 "mkdir -p /www/xonefi-app"
   scp -O -r dist/* root@192.168.1.1:/www/xonefi-app/
   ```

# Nodogsplash configuration

6. configure Nodogsplash:
   We currently use all the default settings, just change the name
   ```sh
   uci set nodogsplash.@nodogsplash[0].gatewayname='XOneFi'
   uci commit nodogsplash
   ```
1. Copy Captive portal files: (These files are not on github yet)
   ```sh
   cd /etc/nodogsplash/htdocs/
   wget https://raw.githubusercontent.com/xmeshlab/xonefi/master/router/splash.html
   wget https://raw.githubusercontent.com/xmeshlab/xonefi/master/router/splash.css
   wget https://raw.githubusercontent.com/xmeshlab/xonefi/master/router/status.html
   cd images/
   wget https://raw.githubusercontent.com/xmeshlab/xonefi/master/router/xmesh-favicon.jpg
   wget https://raw.githubusercontent.com/xmeshlab/xonefi/master/router/xonefi-logo.jpg
   ```
1. Restart Nodogsplash:
   ```sh
   /etc/init.d/nodogsplash restart
   ```
