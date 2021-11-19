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
 * Obtain from the client session state the timestamp of the last SACK sent to the provider.
 * @returns {int} Timestamp of the last SACK.
 */
function get_last_sack_timestamp() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.client_session.last_sack_timestamp;
}


/**
 * Save in the client session state the timestamp (UNIX timestamp in seconds) of the last SACK sent to the provider.
 * @param {int} stamp - timestamp of the last SACK (satisfaction acknowledgement).
 * @returns {boolean} true: success; false: failure.
 */
function set_last_sack_timestamp(stamp) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.client_session.last_sack_timestamp = stamp;
    config.write_default_config(config_json);
    return true;
}

module.exports = { get_last_sack_timestamp, set_last_sack_timestamp };