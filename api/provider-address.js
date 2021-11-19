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
 * Obtain the Ethereum address of the provider from the config.
 * @returns {string} Ethereum address of the currently configured provider (in EIP-55-checksummed format)
 */
function get_provider_address() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.client_session.provider_address;
}

/**
 * Save in the configuration the Ethereum address of the current provider.
 * @param {string} addr - Ethereum address (identity) of the provider.
 * @returns {boolean} true: success; false: failure
 */
function set_provider_address(addr) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.client_session.provider_address = addr;
    config.write_default_config(config_json);
    return true;
}

module.exports = { get_provider_address, set_provider_address };