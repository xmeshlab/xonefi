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
 * Scan for Wi-Fi SSIDs
 * @param {string} iface - 802.11 interface
 * @param {function} callback Passes the object consisting of SSIDs and corresponding RSSI levels (ranging 0..255)
 */
function ssid_scan(iface, callback) {
    var wifi = require('node-wifi');

    wifi.init({
        iface: iface
    });
    
    wifi.scan((error, networks) => {
        if (error) {
            console.log("Continue scanning...");
        } else {
            console.log(`Scan succeeded!`);
            let ssids = [];
            let rssis = [];

            for(x of networks) {
                //console.log(`[147aef5eaa]: x.ssid: '${x.ssid}'`);
                if (x.ssid !== '') {
                    ssids.push(x.ssid);
                    //console.log(`[147aef5eaa]: x.signal_level: '${x.signal_level}'`);
                    rssis.push(
                        2.55 * 2 * (Number(x.signal_level) + 100)
                    );
                }
            }

            return callback({ssids, rssis});
        }
    });
}


/**
 * Experimental version of the scanner for Wi-Fi SSIDs
 * @param {string} iface - 802.11 interface
 * @param {function} callback Passes the object consisting of SSIDs and corresponding RSSI levels (ranging 0..255)
 */
function ssid_scan_experimental(iface, callback) {
    var iwlist = require('wireless-tools/iwlist');

    iwlist.scan({ iface : iface, show_hidden : true }, function(err, networks) {
        console.log(networks);
        return callback(networks);
    });
}


/**
 * Create a list of HTML select options consisting of the list of OneFi SSIDs available. This call must
 * be obsoleted in the future.
 * @param {array} networks - list of unfiltered networks returned by ssid_scan()
 * @returns {string} HTML code representing the list.
 */
function prepare_ssid_html(networks) {
    // TODO: remove this functionality from the API stack.
    var options = "";

    for (x of filter_onefi_ssids(networks)) {
        options += `<option value="${x}">${x}</option>`;
    }

    return options;
}


/**
 * Store SSIDs in the state/configuration
 * @param {array} ssids - list of SSIDs
 * @returns {boolean} true: success; false: failure.
 */
function save_ssids(ssids) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.ssids = ssids;
    config.write_default_config(config_json);
    return true;
}


/**
 * Experimental version of the routine for storing SSIDs in the state/configuration
 * @param {array} ssids - list of networks as returned by ssid_scan()
 * @returns {boolean} true: success; false: failure.
 */
function save_ssids_experimental(networks) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.ssids = networks.map(x => x.ssid);
    config.write_default_config(config_json);
    return true;
}


/**
 * Serialize hotspot parameters into a Base64-encoded OneFi SSID format.
 * @param {Object} ssid_json - JSON object that consists of major parameters of OneFi provider (hotspot).
 * @returns {string} Base64-encoded OneFi SSID (see developer documentation for more information).
 */
function serialize_ssid(ssid_json) {
    var protocol_version_hex = ssid_json.protocol_version.toString(16).padStart(2, "0");
    var hotspot_type_hex = ssid_json.hotspot_type.toString(16).padStart(2, "0");
    var downlink_hex = ssid_json.downlink.toString(16).padStart(2, "0");
    var uplink_hex = ssid_json.uplink.toString(16).padStart(2, "0");
    var ip_hex = ip_quartet_to_number(ssid_json.ip).toString(16).padStart(8, "0");;
    var port_hex = ssid_json.port.toString(16).padStart(4, "0");
    var cost_hex = ssid_json.cost.toString(16).padStart(8, "0");
    var pafren_hex = ssid_json.pafren.toString(16).padStart(4, "0");
    var prefix_hex = ssid_json.prefix;

    var ss = protocol_version_hex + hotspot_type_hex + downlink_hex
        + uplink_hex + ip_hex + port_hex + cost_hex
        + pafren_hex + prefix_hex;

    var base64_part = Buffer.from(ss, 'hex').toString('base64');

    return "OF" + base64_part;
}


/**
 * Convert Base64-encoded OneFi SSID into a JSON object with hotspot parameters.
 * @param {string} ssid - Base64-encoded OneFi SSID with serialized parameters (see dev. documentation for more information).
 * @returns {Object} JSON object with hostpot parameters.
 */
function deserialize_ssid(ssid) {
    var base64_part = ssid.substring(2);
    var decoded_str = Buffer.from(base64_part, 'base64').toString('hex');
    var protocol_version_hex = decoded_str.substring(0,2);
    var hotspot_type_hex = decoded_str.substring(2,4);
    var downlink_hex = decoded_str.substring(4,6);
    var uplink_hex = decoded_str.substring(6,8);
    var ip_hex = decoded_str.substring(8,16);
    var port_hex = decoded_str.substring(16,20);
    var cost_hex = decoded_str.substring(20,28);
    var pafren_hex = decoded_str.substring(28,32);
    var prefix_hex = decoded_str.substring(32,42);

    let ssid_json = {};

    ssid_json.protocol_version = parseInt(protocol_version_hex, 16);
    ssid_json.hotspot_type = parseInt(hotspot_type_hex, 16);
    ssid_json.downlink = parseInt(downlink_hex, 16);
    ssid_json.uplink = parseInt(uplink_hex, 16);
    ssid_json.ip = ip_number_to_quartet(parseInt(ip_hex, 16));
    ssid_json.port = parseInt(port_hex, 16);
    ssid_json.cost = parseInt(cost_hex, 16);
    ssid_json.pafren = parseInt(pafren_hex, 16);
    ssid_json.prefix = prefix_hex;

    return ssid_json;
}


/**
 * Convert IPv4 address into a number
 * @param {string} ip_quartet - IPv4 address in the A.B.C.D format, 0 <= A,B,C,D <= 255
 * @returns {int} Number representing the IP address.
 */
function ip_quartet_to_number(ip_quartet) {
    var ss = ip_quartet.split(".");

    var n1 = parseInt(ss[0]);
    var n2 = parseInt(ss[1]);
    var n3 = parseInt(ss[2]);
    var n4 = parseInt(ss[3]);

    var nn = n1 * 16777216 + n2 * 65536 + n3 * 256 + n4;
    return nn;
}


/**
 * Convert IPv4 address encoded in a number into the canonical A.B.C.D format
 * @param {int} ip_number - number representing the IP address
 * @returns {string} IPv4 address in the canonical A.B.C.D format.
 */
function ip_number_to_quartet(ip_number) {
    var n1 = Math.floor(ip_number / 16777216);
    ip_number = ip_number - 16777216 * n1;

    var n2 = Math.floor(ip_number / 65536);
    ip_number = ip_number - 65536 * n2;

    var n3 = Math.floor(ip_number / 256);
    var n4 = ip_number - 256 * n3;

    return `${n1}.${n2}.${n3}.${n4}`;
}


/**
 * Creates the hotspot parameters object that is used for serialization into the OneFi SSID.
 * @param {int} _protocol_version - integer version of the protocol
 * @param {int} _hotspot_type - encoded hotpost type (see developer documentation for more information)
 * @param {int} _downlink - downlink speed tier
 * @param {int} _uplink - uplink speed tier
 * @param {string} _ip - IPv4 address in the canonical format
 * @param {int} _port - UDP port
 * @param {string} _cost - cost per unit (either gigabyte or hour, depending on the mode)
 * @param {int} _pafren - PAFREN percentage
 * @param {string} _prefix - 10 lowercase leading symbols from the Ethereum address of the provider.
 * @returns {{protocol_version, cost, pafren, port, downlink, uplink, prefix, ip, hotspot_type}} JSON object suitable for
 * being used in serialization.
 */
function compile_ssid_json(
    _protocol_version,
    _hotspot_type,
    _downlink,
    _uplink,
    _ip,
    _port,
    _cost,
    _pafren,
    _prefix
) {
    let json = {
        protocol_version: _protocol_version,
        hotspot_type: _hotspot_type,
        downlink: _downlink,
        uplink: _uplink,
        ip: _ip,
        port: _port,
        cost: _cost,
        pafren: _pafren,
        prefix: _prefix
    };

    return json;
}

/**
 * Generate OneFi SSID using the data from the state/config of the hotspot.
 * @returns {string} Serialized Base64-encoded OneFi SSID string.
 */
function generate_ssid() {
    const config = require("./config");
    let config_json = config.read_default_config();
    const account = require("./account");
    const hotspot_type = require("./hotspot-type");

    var cost = 0;

    if(config_json.cft) {
        cost = config_json.price_ofi_hr;
    } else if(config_json.cfd) {
        cost = config_json.price_ofi_mb;
    } else {
        cost = 0;
    }

    let ssid_json = compile_ssid_json(
        0,
        hotspot_type.calculate_hotspot_type(true),
        config_json.min_downlink_tier,
        config_json.min_uplink_tier,
        config_json.provider_ip,
        config_json.port,
        cost,
        config_json.pafren_percentage,
        account.get_account_raw_prefix()
    );

    return serialize_ssid(ssid_json);
}

/**
 * Check if the given SSID matches the OneFi format.
 * @param {string} ssid - SSID candidate
 * @returns {boolean} true: matches, false: doesn't match.
 */
function is_onefi_ssid(ssid) {
    if(ssid.length > 2) {
        if(ssid[0] === 'O' && ssid[1] === 'F') {
            let base64_part = ssid.substring(2);
            let decoded_str = Buffer.from(base64_part, 'base64').toString('hex');
            return decoded_str.length === 42;
        }
    }

    return false;
}

/**
 * Filter OneFi networks out all all scanned networks.
 * @param {Object} networks - JSON object consisting two arrays: ssids and rssis
 * @returns {Object} Filtered list of OneFi networks in the JSON object format consisting two
 * arrays: ssids and rssis.
 */
function filter_onefi_neworks(networks) {
    let res = {ssids: [], rssis: [] };

    for(let i = 0; i < networks.ssids.length; i++) {
        let x = networks.ssids[i];

        if(is_onefi_ssid(x)) {
            res.ssids.push(networks.ssids[i]);
            res.rssis.push(networks.rssis[i]);
        }
    }

    return res;
}


/**
 * Filter OneFi SSIDs out of a given list of candidates.
 * @param {array} ssids - Array of SSIDs (candidates)
 * @returns {array} Filtered array of SSIDs matching the OneFi format.
 */
function filter_onefi_ssids(ssids) {
    let res = [];

    for(let i = 0; i < ssids.length; i++) {
        let x = ssids[i];
        if(is_onefi_ssid(x)) {
            res.push(ssids[i]);
        }
    }

    return res;
}


module.exports = {
    ssid_scan,
    ssid_scan_experimental,
    prepare_ssid_html,
    save_ssids,
    save_ssids_experimental,
    serialize_ssid,
    deserialize_ssid,
    filter_onefi_ssids,
    compile_ssid_json,
    generate_ssid,
    is_onefi_ssid,
    filter_onefi_neworks
};
