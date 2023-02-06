/*
SPDX-License-Identifier: GPL-3.0-or-later

Copyright (c) 2019-2021 OneFi <https://onefi.io>

OneFi is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

OneFi Router is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with OneFi Router.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * Generates the hotspot type number to encode in SSID.
 * @param {boolean} active - true if the hotspot (AP) is active, false otherwise.
 * @returns {int} Corresponding number suitable for being used in OneFi Base64-encoded SSID format.
 */
function calculate_hotspot_type(active) {
    const config  = require("./config");
    let config_json = config.read_default_config();

    let tmp;
    if(active) {
        tmp = 0b10000000;
    } else {
        tmp = 0b00000000;
    }

    if(config_json.cft) {
        tmp = tmp | 0b00100000;
    } else if(config_json.cfd) {
        tmp = tmp | 0b01000000;
    } else {
        tmp = tmp | 0b00000000;
    }

    if(config_json.network === "mainnet") {
        tmp = tmp | 0b00000000;
    } else if(config_json.network === "goerli") {
        tmp = tmp | 0b00001000;
    } else if(config_json.network === "kovan") {
        tmp = tmp | 0b00010000;
    } else {
        tmp = tmp | 0b00011000;
    }

    return tmp;
}

/**
 * Converts the hotspot type encoded number into a usable JSON object.
 * @param {int} hotspot_type - encoded hotspot (AP) type as appears in Base64-encoded OneFi SSID format.
 * @returns {{access_method: string, blockchain_network: string, reserved_field: number, status: boolean}} JSON object
 * decoding the hotspot type.
 */
function decode_hotspot_type(hotspot_type) {

    let hts = hotspot_type.toString(2);

    while(hts.length < 8) {
        hts = "0" + hts;
    }
    console.log(hts);

    let f1 = parseInt(hts.substr(0, 1), 2);
    let f2 = parseInt(hts.substr(1, 2), 2);
    let f3 = parseInt(hts.substr(3, 2), 2);
    let f4 = parseInt(hts.substr(5, 3), 2);

    let actual_status = false;
    let actual_access_method = "";
    let actual_blockchain_network = "";
    let actual_reserved_field = f4;

    if(f1 === 1) {
        actual_status = true;
    } else {
        actual_status = false;
    }

    if(f2 === 0) {
        actual_access_method = "free";
    } else if(f2 === 1) {
        actual_access_method = "pft";
    } else if(f2 === 2) {
        actual_access_method = "pfd";
    } else {
        actual_access_method = "restricted";
    }

    if(f3 === 0) {
        actual_blockchain_network = "mainnet";
    } else if(f3 === 1) {
        actual_blockchain_network = "goerli";
    } else if(f3 === 2) {
        actual_blockchain_network = "kovan";
    } else {
        actual_blockchain_network = "reserved";
    }

    return {
        status: actual_status,
        access_method: actual_access_method,
        blockchain_network: actual_blockchain_network,
        reserved_field: actual_reserved_field
    };
}

module.exports = { calculate_hotspot_type, decode_hotspot_type };