#!/bin/bash
echo "+===================+"
echo "| Welcome to OneFi! |"
echo "+===================+"

echo "[*** Installing NPM ***]"
sudo apt install npm

echo "[*** Updating NPM ***]"
sudo npm i npm@latest -g

echo "[*** Installing API NPM modules ***]"
cd ../api && yes Y | npm install

echo "[*** Installing Provider NPM modules ***]"
cd ../provider-daemon && yes Y | npm install

echo "[*** Installing Client NPM modules ***]"
cd ../client-daemon && yes Y | npm install

echo "[*** Installing Desktop App NPM modules ***]"
cd ../app && yes Y | npm install

echo "[*** Installing ebtables ***]"
sudo apt install ebtables

#echo "[*** Installing RaspAP ***]"
#sudo curl -sL https://install.raspap.com | bash



