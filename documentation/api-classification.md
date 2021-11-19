# API Modules Classification

OneFi API aims to serve both the client and the provider. However, some modules are to be used by clients only, some modues are for providers, and some are used for both. This document provides a breakdown of target user of each OneFi API module.

## API Modules Used by Clients

* ssid
* fast_hotspot_selection
* client_session
* session-status
* timestamp
* symcrypto
* uuid
* hotspot-type
* scan_counter
* config
* sack-timestamp
* wifi-connect
* call_hello
* call_pafren
* call_handover
* encode-pafren
* call_sack
* encode-sack
* sack_number
* handover_helper
* sackok
* process_mgmt

## API Modules Used Exclusively by Clients

* ssid
* fast_hotspot_selection
* client_session
* session-status
* uuid
* hotspot-type
* scan_counter
* sack-timestamp
* wifi-connect
* call_hello
* call_pafren
* call_handover
* encode-pafren
* call_sack
* encode-sack
* sack_number
* handover_helper
* sackok

NOTE: `uuid` API module will be incorporated in the provider in the future.

## API Modules Used by Providers

* config
* symcrypto
* timestamp
* process_mgmt
* session-status
* e2e_mode

## API Modules Used Exclusively by Providers

none (at this time)

## API Modules Used by Both Providers and Clients

* config
* symcrypto
* timestamp
* process_mgmt
* session-status

# API Modules Used by Electron UI
* log
* config
* account
* client
* provider
* bnetwork
* infura
* balances
* privateaccess
* ip
* pafren
* wlan-interfaces
* ssid
* e2e_mode

# API Modules Used Exclusively by Electron UI
* log
* account
* client
* provider
* bnetwork
* infura
* balances
* privateaccess
* wlan-interfaces

# API Modues Used Only Internally (by API)
* files
* hexbytemagic
