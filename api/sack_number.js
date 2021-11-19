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
 * Retrieve the most recent SACK (satisfaction acknowledgement) number from the client session state.
 * @returns {int} Most recent SACK number.
 */
function get_sack_number() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.client_session.sack_number;
}


/**
 * Save in the client session state the most recent SACK number.
 * @param {int} number - the serial number of the most recent SACK
 * @returns {boolean} true: success; false: failure.
 */
function set_sack_number(number) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.client_session.sack_number = parseInt(number);
    config.write_default_config(config_json);
    return true;
}


/**
 * Retrieve the serial number of the SACK, which is in the process of sending, but has not sent yet to the provider.
 * This number prevents re-entrancy in the SACK workflow.
 * @returns {int} The number of the SACK that is in the process of sending.
 */
function get_initiated_sack_number() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.client_session.initiated_sack_number;
}


/**
 * Save in the client session state the serial number of the SACK that is initiated, but not yet sent-and-processed
 * by the provider.
 * @param {int} number - Serial number of the initiated SACK
 * @returns {boolean} true: success; false: failure.
 */
function set_initiated_sack_number(number) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.client_session.initiated_sack_number = number;
    config.write_default_config(config_json);
    return true;
}

module.exports = {
    get_sack_number,
    set_sack_number,
    get_initiated_sack_number,
    set_initiated_sack_number
};