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
 * Return currently selected blockchain network (i.e., goerli, Mainnet, Kovan, etc.)
 * @returns {string} Ethereum blockchain network: currently, "goerli", "mainnet", or "kovan".
 */
function get_bnetwork() {
    const config = require("./config");
    let config_json = config.read_default_config();
    return config_json.network;
}


/**
 * Set (save in configuration) the currently used Ethereum blockchain network.
 * @param {string} net - Ethereum blockchain network: "goerli", "mainnet", or "kovan".
 * @returns {boolean} true - success, false - failure.
 */
function set_bnetwork(net) {
    const config = require("./config");
    config_json = config.read_default_config();
    config_json.network = net;
    config.write_default_config(config_json);
    return true;
}


/**
 * Callback-driven version of get_bnetwork. Return current Ethereum blockchain network
 * @param {function(string)} callback - Set parameter to "goerli", "mainnet", or "kovan".
 */
function get_bnetwork_db(callback) {
    const config = require("./config");

    config.read_default_config_db((config_json) => {
        return callback(config_json.network);
    });

    return callback("");
}


/**
 * Set (save in configuration) the currently used Ethereum blockchain network. Async version.
 * @param {string} net - Ethereum blockchain network: "goerli", "mainnet", or "kovan".
 * @param {function(boolean)} callback Return status: true - success, false - failure.
 */
function set_bnetwork_db(net, callback) {
    const config = require("./config");

    config.read_default_config_db((config_json) => {
        config_json.network = net;
        config.write_default_config_db(config_json, () => {
            return callback(true);
        })
    })

    return callback(false);
}


module.exports = {
    get_bnetwork_db,
    set_bnetwork_db,
    get_bnetwork,
    set_bnetwork
};
