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
 * Check if a given IPv4 address string is valid.
 * @param {string} ip - IPv4 address string in the A.B.C.D format, 0 <= A,B,C,D <= 255
 * @returns {boolean} true if the given string is a valid IPv4 address, false otherwise.
 */
function valid_ip(ip) {
    components = ip.split(".", 10);
    if(components.length !== 4) {
        return false;
    }

    for (x of components) {
        if(x.length === 0) {
            return false;
        }

        a = parseInt(x)
        if (a < 0 || a > 255) {
            return false;
        }
    }

    return true;
}

/**
 * Reads (from configuration/state) the current provider IP address,
 * @returns {string} IP address in the A.B.C.D format, 0 <= A,B,C,D <= 255
 */
function get_provider_ip() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.provider_ip;
}

/**
 * Saves in the configuration the current provider's IP address
 * @param {string} ip_address IPv4 address in the A.B.C.D format, 0 <= A,B,C,D <= 255
 * @returns {boolean} true: success, false: failure.
 */
function set_provider_ip(ip_address) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.provider_ip = ip_address;
    config.write_default_config(config_json);
    return true;
}

/**
 * Read from the configuration (a.k.a. "system state", a.k.a. "onefi.json") the UDP port of provider that is used
 * to accept requests from the client.
 * @returns {int} UDP port of the current OneFi provider (i.e., the provider running on this deveice).
 */
function get_port() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.port;
}

/**
 * Save in the configuration (i.e., onefi.json state file) the UDP port used by the provider to listen requests from
 * the clients.
 * @param {int} port - UDP port
 * @returns {boolean} true: success, false: failure.
 */
function set_port(port) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.port = parseInt(port);
    config.write_default_config(config_json);
    return true;
}


/**
 * Check if the port value is valid
 * @param {int} port - UDP port
 * @returns {boolean} true: valid, false: invalid.
 */
function valid_port(port) {
    if(!isNaN(port) // TODO: simplify the statement
        && !isNaN(parseFloat(port))
        && parseInt(port) >= 0
        && parseInt(port) <= 65535
        && parseInt(port) === parseFloat(port)) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    valid_ip,
    get_provider_ip,
    set_provider_ip,
    get_port,
    set_port,
    valid_port
};