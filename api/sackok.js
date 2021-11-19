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
 * Retrieve from the client session state the most recent SACK-OK from the provider, which is used as the proof of
 * the onlgoing session for session handover.
 * @returns {Object} JSON object - the entire SACK-OK message from the provider.
 */
function get_sackok() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.client_session.sackok;
}


/**
 * Store in the client session state the most recent SACK-OK messge retrieved from the provider.
 * @param {Object} sackok - JSON object comprising the entire SACK-OK message from the provider.
 * @returns {boolean} true: success, false: failure.
 */
function set_sackok(sackok) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.client_session.sackok = sackok;
    config.write_default_config(config_json);
    return true;
}

module.exports = { get_sackok, set_sackok };