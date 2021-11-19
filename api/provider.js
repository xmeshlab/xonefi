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
 * Read from configuration the status of the provider (whether it is on or off).
 * @returns {boolean} true: on; false: off.
 */
function get_provider_status() {
    const config = require("./config");
    let config_json = config.read_default_config();
    return config_json.ap_on;
}

/**
 * Set the state of the provider in the configuration.
 * @param {boolean} enabled - true: enabled, false: disables
 * @returns {boolean} true: success, false: failure.
 */
function set_provider_status(enabled) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.ap_on = enabled;
    config.write_default_config(config_json);
    return true;
}

/**
 * Read from configuration the value of the CFD (charge for data) provider's parameter.
 * @returns {boolean} true: CFD mode is activated; false: CFD mode is deactivated.
 */
function get_charge_for_data() {
    const config = require("./config");
    let config_json = config.read_default_config();
    return config_json.cfd;
}

/**
 * Set the CFD (charge for data) parameter for provider.
 * @param {boolean} enabled: true: enable, false: deactivate.
 * @returns {boolean} true: success, false: failure.
 */
function set_charge_for_data(enabled) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.cfd = enabled;
    config.write_default_config(config_json);
    return true;
}

/**
 * Obtain the value of provider's CFT (charge for time) parameter from the configuration.
 * @returns {boolean} true if CFT is enabled, false if otherwise.
 */
function get_charge_for_time() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.cft;
}

/**
 * Store in the configuration the CFT parameter.
 * @param {boolean} enabled - true: enabled, false: disabled.
 * @returns {boolean} true: success, false: failure.
 */
function set_charge_for_time(enabled) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.cft = enabled;
    config.write_default_config(config_json);
    return true;
}

/**
 * Determine from the configuration if the private provider mode is activated.
 * @returns {boolean} true: activated, false: deactivated.
 */
function get_private_provider() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.private_provider;
}


/**
 * Activates the private provider mode in the configuration.
 * @param {boolean} enabled - true: enabled, false: disabled.
 * @returns {boolean} true: success, false: failure.
 */
function set_private_provider(enabled) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.private_provider = enabled;
    config.write_default_config(config_json);
    return true;
}

/**
 * Retrieve from the config the price per gigabyte of data set by the provider.
 * @returns {int} Amount of OFI tokens that the provider requests per gigabyte of traffic.
 */
function get_price_ofi_mb() {
    // TODO: Refactor MB into GB.
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.price_ofi_mb;
}

/**
 * Set the price in OFI tokens that the provider requests for one gigabyte of traffic in the CFD (charge-for data) mode.
 * @param {int} price  - Number of OFI tokens per gigabyte.
 * @returns {boolean} true: success, false: failure.
 */
function set_price_ofi_mb(price) {
    // TODO: Refactor MB into GB.
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.price_ofi_mb = parseInt(price);
    config.write_default_config(config_json);
    return true;
}

/**
 * Retrieve from the configuration the price for one hour of Internet set by the provider for the CFT mode.
 * @returns {int} Number of OFI tokens that the provider expects to be paid for one hour of Internet provided.
 */
function get_price_ofi_hr() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.price_ofi_hr;
}

/**
 * Set in the configuration the price in OneFi points for one hour of traffic in the CFT (charge for time) mode.
 * @param {int} price - number of OneFi tokens (OFI) that the provider charges for 1 hour of traffic in CFT mode.
 * @returns {boolean} true: success, false: failure.
 */
function set_price_ofi_hr(price) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.price_ofi_hr = parseInt(price);
    config.write_default_config(config_json);
    return true;
}

module.exports = {
    get_charge_for_data,
    set_charge_for_data,
    get_charge_for_time,
    set_charge_for_time,
    get_private_provider,
    set_private_provider,
    get_price_ofi_mb,
    set_price_ofi_mb,
    get_price_ofi_hr,
    set_price_ofi_hr,
    set_provider_status,
    get_provider_status
};
