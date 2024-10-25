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
 * Save RPC (Ethereum blockchain API service used by OneFi) API token (ID) in the config.
 * @param {string} id - API token
 * @returns {boolean} - true: success; false: failure
 */
function save_rpc_id(id) {
    const config = require("./config");
    var config_json = config.read_default_config();
    config_json.rpc_api_key = id;
    config.write_default_config(config_json);
    return true;
}


/**
 * Read RPC API key (token) from the config
 * @returns {string} RPC API key.
 */
function get_rpc_id() {
    const config = require("./config");
    var config_json = config.read_default_config();
    return config_json.rpc_api_key;
}

/**
 * Read RPC Websocket from the config
 * @returns {string} RPC Websocket .
 */
function get_rpc_ws() {
    const config = require("./config");
    var config_json = config.read_default_config();
    return config_json.rpc_websocket;
}

/**
 * Save RPC Websocket (Ethereum blockchain API service used by OneFi) n the config.
 * @param {string} id - Websocket string
 * @returns {boolean} - true: success; false: failure
 */
function save_rpc_ws(id) {
    const config = require("./config");
    var config_json = config.read_default_config();
    config_json.rpc_websocket= id;
    config.write_default_config(config_json);
    return true;
}



module.exports = {
    get_rpc_id,
    get_rpc_ws
};