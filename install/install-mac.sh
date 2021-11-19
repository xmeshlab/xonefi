#!/bin/bash
echo "+===================+"
echo "| Welcome to OneFi! |"
echo "+===================+"

echo "[*** Installing NPM ***]"
brew update
brew install node

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


