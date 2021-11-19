# SSID Coding

## Fields

### Field: `protocol_version`
**Type:** 8-bit integer (0..255).

**Description:** Specifies the version of the OneFi smart contract used by the hotspot. The current version is 0.

### Field: `hotspot_type`
**Type:** 8-bit integer (0..255).

**Description:** Specifies the type of hotspot as follows:

New and up-to date description:

```
+==========+=======+===============+===============+=======================+
| bit:     |   0   |   1   |   2   |   3   |   4   |   5   |   6   |   7   |
|----------+-------+---------------+---------------+-----------------------|
| meaning: |status |access method  |blockchain net.| reserved for future   |
+==========+=======+===============+===============+=======================+         
```

Fields:

* status: 0 = inactive, 1 = active
* access method: 00 = free public, 01 = pay-for-time, 10 = pay for data, 11 = restricted (private or enterprise) with pre-approved users.
* blockchain net: 00 - Mainnet, 01 = Ropsten, 10 = Kovan, 11 = reserved for future use; 
* reserved bits: not in use at this time.


**WARNING:** The following description of hotspot type is **obsolete**. It is kept here only for reference:

* 0: hotspot is temporary unavailable;
* 1: free public hotspot;
* 2: pay-for-time hotspot;
* 3: pay-for-traffic hotspot;
* 4: restricted (private or enterprise) hotspot;
* 101: test (Ropsten) free public hotspot;
* 102: test (Ropsten) pay-for-time hotspot;
* 103: test (Ropsten) pay-for-traffic hotspot;
* 104: test (Ropsten) restricted (private or enterprise) hotspot;
* 5..100 & 105..255: reserved for future use.





### Field: `downlink`
**Type:** 8-bit integer (0..255).

**Description:** Specifies the declared mimimum available downlink bandwidth as follows:

* 0: bandwidth is not specified;
* 1: 2 kbps;
* 2: 4 kbps;
* 3: 8 kbps;
* 4: 16 kbps;
* 5: 32 kbps;
* 6: 64 kbps;
* 7: 128 kbps;
* 8: 256 kbps;
* 9: 512 kbps;
* 10: 1 Mbps;
* 11: 2 Mbps;
* 12: 4 Mbps;
* 13: 8 Mbps;
* 14: 16 Mbps;
* 15: 32 Mbps;
* 16: 64 Mbps;
* 17: 128 Mbps;
* 18: 256 Mbps;
* 19: 512 Mbps;
* 20: 1 Gbps;
* 21: 2 Gbps;
* 23: 4 Gbps;
* 24: 8 Gbps;
* 25: 16 Gbps;
* 26..31: reserved for future use.

### Field: `uplink`
**Type:** 8-bit integer (0..255).

**Description:** Specifies the declared mimimum available uplink bandwidth as follows:

* 0: bandwidth is not specified;
* 1: 2 kbps;
* 2: 4 kbps;
* 3: 8 kbps;
* 4: 16 kbps;
* 5: 32 kbps;
* 6: 64 kbps;
* 7: 128 kbps;
* 8: 256 kbps;
* 9: 512 kbps;
* 10: 1 Mbps;
* 11: 2 Mbps;
* 12: 4 Mbps;
* 13: 8 Mbps;
* 14: 16 Mbps;
* 15: 32 Mbps;
* 16: 64 Mbps;
* 17: 128 Mbps;
* 18: 256 Mbps;
* 19: 512 Mbps;
* 20: 1 Gbps;
* 21: 2 Gbps;
* 23: 4 Gbps;
* 24: 8 Gbps;
* 25: 16 Gbps;
* 26..31: reserved for future use.

### Field: `ip`
**Type:** Decimal period-separated quartet string ("0-255.0-255.0-255.0-255")

**Description:** Specifies the local IP address of the OneFi Communicator.


### Field: `port`
**Type:** 16-bit integer (0..65535).

**Description:** Specifies the local UDP port of the OneFi Communicator.

### Field: `cost`
**Type:** 32-bit integer (0..4294967295).

**Description:** For paid hotspots, specifies the cost of unit (either data size of time). Specifically:

* If `protocol_version` is 2, then this parameter specifies the number of ERC-20 tokens to be paid for 1 hour of connection.
* If `protocol_version` is 3, then this parameter specifies the number of ERC-20 tokens to be paid for 1 gigabyte of traffic.

For the current version of the the protocol (0), 1 OneFi token is set to 10^12 wei (0.000001 Ether or 1 Szabo).


### Field: `pafren`
**Type:** 16-bit integer (0..65535).

**Description:** For paid hotspots, this parameter indicates the *percentage* of units (either time or data, depending on the hotspot type) that the client must have funds for in order to establish a connection. Traffic funds are always reserved for approximately 24 hours. For example, if `hotspot_type` is 2, `cost` is 10,000, and `pafren` is 2400, it means that the client must own 240,000 OneFi ERC-20 tokens and ready to provide the hotspot with a PAFREN (PArtial FReeze ENdorsement), that will prevent spending of these funds for other hotspots for 24 hours. This parameter is ignored for free hotspots.

### Field: `prefix`
**Type:** 40-bit (10 digits) hexadecimal string ("0000000000".."ffffffffff").

**Description:** This parameter is the 10-digit prefix of the hotspot's public address. It is used for two purposes: 1) application-layer handoff of existing OneFi session (DNSH -- Decentralized Nonsequential Session Handoff), and 2) searching for hotspot providing restricted access.
**IMPORTANT NOTE**: This parameter is used for search, not for identification. Mining a 40-bit collision of this prefix is no-brainer, so this prefix must not be assumed as unique, despite the fact that in most cases it will be factually unique.

## Sample `ssid.json` for a paid hotspot

```
{
    "protocol_version": 0,
    "hotspot_type": 103,
    "downlink": 12,
    "uplink": 10,
    "ip": "192.168.0.173",
    "port": 3141,
    "cost": 7900,
    "pafren": 100,
    "prefix": "d1feb8d074"
}
```

***Description:*** This JSON is used to generate an SSID for the hotspot that informs the client (without connection) about the following:

* The hotspot is paid, but it operates on Ropsten Testnet. So the payment is made with a test Ether.
* The hotspot is paid per traffic.
* The available downlink bandwidth of this hotspot is at least 4 Mbps.
* The available uplink bandwidth of this hotspot is at least 1 Mbps.
* The client should communicate with this hotspot, upon connection, through the IP address 192.168.0.173.
* The client should send UDP requests to port 3141.
* The cost of 1 Gb of traffic in this hotspot is 7,900 OFI (~0.007899 ETH).
* The hotspot is unrestricted (available to everyone).
* The hotspot requires the client to have 7,900 OFI (to pay for 100% of 1 Gb) of unfrozen funds available for reserving for 24 hours.
* The hotspot requires the user to cryptographically acknowledge satisfaction after each 4 megabytes of traffic.

As a result, the above JSON is encoded into the OneFi SSID, which never exceeds 32 characters regulated by IEEE 802.11 standard.