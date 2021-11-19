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
 * Obtain the list of private providers from the config.
 * @returns {array} JSON array of the private providers.
 */
function get_priv_providers() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.private_providers;
}

/**
 * Saves the list of private providers in the configuration (state).
 * @param {array} providers - JSON array of private providers.
 * @returns {boolean} true: success, false: failure.
 */
function save_priv_providers(providers) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.private_providers = providers;
    config.write_default_config(config_json);
    return true;
}

/**
 * Get the list of private clients (subscribers) that OneFi provider has on list to provide connection to.
 * @returns {array} JSON array of Ethereum addresses of subscribers.
 */
function get_priv_clients() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.private_clients;
}

/**
 * Save in the configuration (a.k.a. "onefi.json") the list of clients' Ethereum addresses that are subscribers of the
 * current provider.
 * @param {array} clients - JSON array of subscribers' addresses.
 * @returns {boolean} true: success; false: failure.
 */
function save_priv_clients(clients) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.private_clients = clients;
    config.write_default_config(config_json);
    return true;
}

module.exports = {
    get_priv_providers,
    save_priv_providers,
    get_priv_clients,
    save_priv_clients
};
