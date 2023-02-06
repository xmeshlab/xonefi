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
 * Thread/concurrency-safe procedure for reading smart contract-related configuration JSON object.
 * @returns {Object} JSON object with smart contract configuration parameters.
 */
function get_current_contract_config_json() {
    const config = require("./config");
    const config_json = config.read_default_config();

    if(config_json.network === "goerli") {
        return config.read_config("../contract-goerli.json");
    } else if(config_json.network === "kovan") {
        return config.read_config("../contract-kovan.json");
    } else if(config_json.network === "mainnet") {
        return config.read_config("../contract-mainnet.json");
    } else {
        return {};
    }
}

/**
 * Thread/concurrency-safe async procedure for reading smart contract-related configuration JSON object.
 * @param {function} callback: returns an object with smart contract configuration parameters.
 */
function get_current_contract_config_json_db(callback) {
    const config = require("./config");

    config.read_default_config_db((config_json) => {
        if(config_json.network === "goerli") {
            return callback(config.read_config("../contract-goerli.json"));
        } else if(config_json.network === "kovan") {
            return callback(config.read_config("../contract-kovan.json"));
        } else if(config_json.network === "mainnet") {
            return callback(config.read_config("../contract-mainnet.json"));
        } else {
            return callback({});
        }
    });
}

module.exports = {
    get_current_contract_config_json_db,
    get_current_contract_config_json
};