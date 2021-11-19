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
 * Read current client status from the config (whether the client is on or off).
 * @returns {boolean} true - client is on, false - client is off.
 */
function get_client_status() {
    const config = require("./config");
    let config_json = config.read_default_config();
    return config_json.client_on;
}

/**
 * Set (save in configuration) the current status of OneFi client.
 * @param {boolean} enabled - client status (true = enabled, false = disabled).
 * @returns {boolean} true - success, false - failure.
 */
function set_client_status(enabled) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.client_on = enabled;
    config.write_default_config(config_json);
    return true;
}

/**
 * Read the client PFD (pay for data) parameter value from OneFi configuration.
 * @returns {boolean} true: client agrees to pay for data; false: client disagrees to pay for data.
 */
function get_pay_for_data() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.pfd;
}

/**
 * Set (save in configuration) the current status of PFD (pay-for-data) client parameter.
 * @param {boolean} enabled - client PFD (true = enabled, false = disabled).
 * @returns {boolean} true - success, false - failure.
 */
function set_pay_for_data(enabled) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.pfd = enabled;
    config.write_default_config(config_json);
    return true;
}

/**
 * Read the client PFT (pay for time) parameter value from OneFi configuration.
 * @returns {boolean} true: client agrees to pay for time; false:  client disagrees to pay for time.
 */
function get_pay_for_time() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.pft;
}

/**
 * Set (save in configuration) the current status of PFT (pay-for-time) client parameter.
 * @param {boolean} enabled - client PFT (true = enabled, false = disabled).
 * @returns {boolean} true - success, false - failure.
 */
function set_pay_for_time(enabled) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.pft = enabled;
    config.write_default_config(config_json);
    return true;
}

/**
 * Read the private client parameter value from OneFi configuration.
 * @returns {boolean} true: client agrees for private connections; false: client disagrees for private (restricted) connections.
 */
function get_private_client() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.private_client;
}

/**
 * Set (save in configuration) the current status of private client parameter.
 * @param {boolean} enabled - private (restricted) client parameter (true = enabled, false = disabled).
 * @returns {boolean} true: success; false: failure.
 */
function set_private_client(enabled) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.private_client = enabled;
    config.write_default_config(config_json);
    return true;
}

/**
 * Read from OneFi configuration the maximum number of OneFi tokens the client is ready to pay for one gigabyte of
 * data in the PFD mode.
 * @returns {int} maximum number of OFI (OneFi points/tokens) the client is willing to pay for one GB of data.
 */
function get_max_ofi_mb() {
    // TODO: Refactor to GB from MB.
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.max_ofi_mb;  // TODO: refactor this config parameter to account for GB, not MB.
}

/**
 * Set (save in configuration) the maximum number of OneFi tokens (points) that the client is ready to pay
 * for one gigabyte of data in the PFD (pay-for-data) mode.
 * @param {int} max_price - maximum number of OFI (OneFi tokens/points) the client is willing to pay.
 * @returns {boolean} true: success; false: failure.
 */
function set_max_ofi_mb(max_price) {
    // TODO: Refactor to GB, not MB.
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.max_ofi_mb = max_price; // TODO: refactor this config parameter to account for GB, not MB.
    config.write_default_config(config_json);
    return true;
}


/**
 * Read from OneFi configuration the maximum number of OneFi tokens the client is ready to pay for one hour
 * of unlimited Internet connection in the PFT (pay-for-time) mode.
 * @returns {int} maximum number of OFI (OneFi points/tokens) the client is willing to pay for one hour of connection.
 */
function get_max_ofi_hr() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.max_ofi_hr;
}

/**
 * Set (save in configuration) the maximum number of OneFi tokens (points) that the client is ready to pay
 * for one hour of Internet traffic in the PFT (pay-for-time) mode.
 * @param {int} max_price - maximum number of OFI (OneFi tokens/points) the client is willing to pay.
 * @returns {boolean} true: success; false: failure.
 */
function set_max_ofi_hr(max_price) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.max_ofi_hr = max_price;
    config.write_default_config(config_json);
    return true;
}


module.exports = {
    set_client_status,
    get_client_status,
    set_pay_for_data,
    set_pay_for_time,
    set_private_client,
    get_pay_for_data,
    get_pay_for_time,
    get_private_client,
    get_max_ofi_mb,
    set_max_ofi_mb,
    get_max_ofi_hr,
    set_max_ofi_hr
};
