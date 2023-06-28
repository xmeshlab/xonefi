# XOneFi - Global Decentralized Wireless Connectivity

<p align="center">
<img width="320" src="/app/logo-v3.png">
</p>



Connected seamlessly -- XOneFi offers wireless connectivity, wherever you are, seamlessly. Become a XOneFi provider or add your enterprise to XOneFi.

## Mobile Apps

<p align="center">
<img width="500" src="/app/app1.png">
</p>

<p align="center">
<img width="320" src="/app/app2.png">
</p>


## How It Works

* If you want free service, install the XOneFi, and XOneFi will do everything else for you whenever it discovers a XOneFi provider.
* If you want paid service, install the XOneFi, buy XOneFi tokens, configure your maximum payment rate, and XOneFi will do everything else for you.
* If you want to be a XOneFi provider, install XOneFi, configure how much you want to charge, and you are now a wireless provider!

## Installation

To install XOneFi on Raspberry Pi, download this code, and run the following command from the root folder of the code:

```
cd install && ./install-rpi4.sh
```

and answer affirmatively to all the questions.


To install XOneFi on Ubuntu Linux (18.04 or later), run the following command:

```
cd install && ./install-ubuntu.sh
```


## Usage

To start XOneFi Manager and background processes, type the following command:

```
./start-onefi.sh
```

If XOneFi is installed correctly, you will see a window similar to this one:

<p align="center">
<img width="460" src="/docs/dev/img/onefi1.png">
</p>

In order to start using XOneFi, either as a provider or as a client, a setup needs to be done using the XOneFi Manager.

## Setting up the offline crypto account

First, use the account tab to generate a crypto account or import an existing account:

<p align="center">
<img width="460" src="/docs/dev/img/onefi2.png">
</p>

When the account is set up, use the Client tab (3rd from the top) or the Provider tab (4th from the top) to specify the corresponding parameters.

## Setting up XOneFi in the Client Mode

On the Client tab, you need to specify the mode you will use the network (pay for data, pay for time or using a private subscription (e.g., family home network or enterprise network at work)). If you use paid hotspots, you need to specify how many XOneFi points you pay for 1 gigabyte or 1 hour of traffic, depending on the mode. Then, specify the maximum percentage of the price that you are willing to **get reserved** (not the same as pre-payment) towards a future connection. For example, if you are willing to pay maximum 300 points per hour in pay-per-data mode, and the percentage is 200%, it means that you allow XOneFi to reserve (temporarily "freeze") at most 600 XOneFi points. If you are using private providers (for example, your home XOneFi router or XOneFi network at work), you need to specify the addresses (identities) of these providers in the `Private Providers` field. When done, please click `Save Changes`.

<p align="center">
<img width="460" src="/docs/dev/img/onefi3.png">
</p>

If you use XOneFi in a Provider mode, you do not need to set up the client.

## Setting up XOneFi in the Provider Mode

On the Provider tab, please specify the mode of XOneFi hotspot. If the hotspot is paid, also provide the prices in XOneFi points, as well as the percentage of price that is required to be reserved before the connection is provided. For clients who use a private subscription (for example, family members at home or co-workers at the office, please specify the list of their public addresses (identities)). Next, specify the IP address associated with the wireless hotspot that is going to be used by XOneFi. If you use Raspberry Pi for the hotspot, we recommend to use RaspAP to set up the WiFi hotspot. Once all parameters are set, click `Click Changes and Update SSID`, and then use the generated SSID as the SSID of your wireless hotspot (you can do it in the control panel of RaspAP).

<p align="center">
<img width="460" src="/docs/dev/img/onefi4.png">
</p>

Whether you use XOneFi in Client or Provider mode, you need to provide a few more settings to complete the setup.

## Finalizing XOneFi Setup

To finalize XOneFi setup, please select the blockchain network that you would like to use. Before using Mainnet, we recommend getting accustomed to the system using one of the testnets, such as Goerli. Then please provide the Infura API, which you can obtain by creating a free account at [https://infura.io](). Finally, choose the WiFi interface (wireless device) for XOneFi.

<p align="center">
<img width="460" src="/docs/dev/img/onefi5.png">
</p>

## Additional information and developer documentation

Please browse the `docs/` folder for more information about XOneFi and details of its design.



