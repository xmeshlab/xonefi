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
 * Obtain the provider's minimum declared downlink tier (see developer documentation for the breakdown).
 * @returns {int} Minimum downlink available bandwidth tier
 */
function get_min_downlink_tier() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.min_downlink_tier;
}


/**
 * Store in the config (state) the provider's minimum declared downlink tier.
 * @param {int} tier - minimum declared downlink tier.
 * @returns {boolean} true: success; false: failure.
 */
function set_min_downlink_tier(tier) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.min_downlink_tier = parseInt(tier);
    config.write_default_config(config_json);
    return true;
}


/**
 * Validate the range and format of the downlink tier value.
 * @param {int} tier - downlink tier value
 * @returns {boolean} true: valid, false: invalid.
 */
function valid_min_downlink_tier(tier) {
    if(!isNaN(tier) // TODO: simplify it
        && !isNaN(parseFloat(tier))
        && parseInt(tier) >= 0
        && parseInt(tier) <= 31
        && parseInt(tier) === parseFloat(tier)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Obtain the provider's minimum declared uplink tier (see developer documentation for the breakdown).
 * @returns {int} Minimum uplink available bandwidth tier
 */
function get_min_uplink_tier() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.min_uplink_tier;
}


/**
 * Store in the config (state) the provider's minimum declared uplink tier.
 * @param {int} tier - minimum declared uplink tier.
 * @returns {boolean} true: success; false: failure.
 */
function set_min_uplink_tier(tier) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.min_uplink_tier = parseInt(tier);
    config.write_default_config(config_json);
    return true;
}


/**
 * Validate the range and format of the uplink tier value.
 * @param {int} tier - uplink tier value
 * @returns {boolean} true: valid, false: invalid.
 */
function valid_min_uplink_tier(tier) {
    if(!isNaN(tier) // TODO: simplify it
        && !isNaN(parseFloat(tier))
        && parseInt(tier) >= 0
        && parseInt(tier) <= 31
        && parseInt(tier) === parseFloat(tier)) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    get_min_downlink_tier,
    set_min_downlink_tier,
    valid_min_downlink_tier,
    get_min_uplink_tier,
    set_min_uplink_tier,
    valid_min_uplink_tier
};