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
 * Read from configuration (a.k.a. "system state") the current pafren percentage (i.e., the amount of OneFi tokens
 * that the provider stipulates to be reserved before providing connection -- as a percentage of the price per
 * unit).
 * @returns {string} Provider's PAFREN percentage.
 */
function get_pafren_percentage() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.pafren_percentage;
}


/**
 * Set PAFREN percentage for the provider into the configuration (state).
 * @param {int} pafren_percentage - PAFREN percentage between 0 and 65535
 * @returns {boolean} true if success, false otherwise.
 */
function set_pafren_percentage(pafren_percentage) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.pafren_percentage = parseInt(pafren_percentage);
    config.write_default_config(config_json);
    return true;
}


/**
 * Verify if the PAFREN percentage is correct.
 * @param pafren_percentage
 * @returns {boolean} true: valid, false: invalid.
 */
function valid_pafren_percentage(pafren_percentage) {
    if(!isNaN(pafren_percentage)
        && !isNaN(parseFloat(pafren_percentage))
        && parseInt(pafren_percentage) >= 0
        && parseInt(pafren_percentage) <= 65535
        && parseInt(pafren_percentage) === parseFloat(pafren_percentage)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Read from configuration (a.k.a. "system state") the maximum PAFREN value (i.e., size of secure pre-payment) that
 * the client is willing to allow be reserved during the handshake.
 * @returns {int} Maximum PAFREN amount.
 */
function get_client_max_pafren() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.client_max_pafren;
}


/**
 * Set in the configuration the maximum number of OneFi tokens that the client allows to be reserved at the beginning
 * of each session with OneFi provider.
 * @param {int} max_pafren - maximum pafren size
 * @returns {boolean} ture: succes; false: failure.
 */
function set_client_max_pafren(max_pafren) {
    const config = require("./config"); // TODO: Eliminate the confusion related to percentage vs. absolute value of PAFREN
    let config_json = config.read_default_config();
    config_json.client_max_pafren = parseInt(max_pafren);
    config.write_default_config(config_json);
    return true;
}

/**
 * Verify if the maximum client PAFREN value is an integer number within the set range.
 * @param {int} max_pafren - maximum PAFREN value
 * @returns {boolean} true: valid; false: invalid.
 */
function valid_client_max_pafren(max_pafren) {
    // TODO: Augment the design to eliminate confusion between percentages and absolute values of PAFREN
    if(!isNaN(max_pafren)
        && !isNaN(parseFloat(max_pafren))
        && parseInt(max_pafren) >= 0
        && parseInt(max_pafren) <= 65535
        && parseInt(max_pafren) === parseFloat(max_pafren)) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    get_pafren_percentage,
    set_pafren_percentage,
    valid_pafren_percentage,
    get_client_max_pafren,
    set_client_max_pafren,
    valid_client_max_pafren
};