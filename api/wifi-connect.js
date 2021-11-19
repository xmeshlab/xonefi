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
 * Connect to the specified Wi-Fi network with the OneFi provider prefix as the password.
 * @param {string} network - SSID of the network.
 * @param {function} callback Pass true on success and false on failure.
 */
function wifi_connect(network, callback) {
    const wifi = require("node-wifi");
    const config = require("./config");
    const ssid = require("./ssid");

    let config_json = config.read_default_config();
    let ssid_json = ssid.deserialize_ssid(network);

    wifi.init({
        iface: config_json.wlan_interface
    });

    console.log(`@wifi_connect network: ${network}, ssid_json.prefix: ${ssid_json.prefix}`);

    wifi.connect({ ssid: network, password: ssid_json.prefix }, error => {
        if (error) {
            console.log(`@wifi_connect ERROR: ${error}`);
            callback(false);
        }

        console.log(`@wifi_connect: Successfully connected to ${network}`);
        callback(true);
    });
}


/**
 * Disconnect from the specified network.
 * @param {string} network - SSID of the Wi-Fi network to disconnect.
 * @param {function} callback - Pass true on success and false otherwise.
 */
function disconnect_and_remove(network, callback) {
    const wifi = require("node-wifi");
    const config = require("./config");

    let config_json = config.read_default_config();

    wifi.init({
        iface: config_json.wlan_interface
    });

    wifi.deleteConnection({ ssid: network }, error => {
        if (error) {
            console.log(error);
            return callback(false);
        } else {
            return callback(true);
        }
    });
}

module.exports = { wifi_connect, disconnect_and_remove };