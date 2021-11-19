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
 * Read current provider Ethernet-to-Ethernet status from the config (whether the mode on or off).
 * @returns {boolean} true - Ethernet-to-Ethernet status is on, false - Ethernet-to-Ethernet status is off.
 */
function get_e2e_status() {
    const config = require("./config");
    let config_json = config.read_default_config();
    return config_json.e2e_mode;
}

/**
 * Set (save in configuration) the current status of Ethernet-to-Ethernet mode.
 * @param {boolean} enabled - provider status (true = enabled, false = disabled).
 * @returns {boolean} true - success, false - failure.
 */
function set_e2e_status(enabled) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.e2e_mode = enabled;
    config.write_default_config(config_json);
    return true;
}

module.exports = { get_e2e_status, set_e2e_status };