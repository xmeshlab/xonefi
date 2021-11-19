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
 * Get the list of Wi-Fi interfaces.
 * @returns {array} List of 802.11 interfaces.
 */
function get_wlan_interfaces() {
    // TODO: This function works only in Linux at this time. Find how to make it cross-platform.
    const assert = require('assert');
    const fs = require("fs");

    let interfaces = [];

    //assert(process.platform === "linux");

    if(process.platform === "linux") {
        dirs = fs.readdirSync("/sys/class/net");

        interfaces = [];
        for(x of dirs) {
            d = "/sys/class/net/" + x + "/wireless";
            if (fs.existsSync(d)) {
                interfaces.push(x);
            }
        }
    } else if(process.platform === "darwin") {
        interfaces.push("en1");
    } else {
        console.log("ERROR: Platform is not supported yet.");
    }

    return interfaces;
}


/**
 * Generates an HTML option list of Wi-Fi interfaces.
 * @param {string} select_class - HTML class of the select element.
 * @param {string} aria_label - value of the Bootstrap aria_label element.
 * @param {string} selected - value of the selected element.
 * @returns {string} Generated HTML code.
 */
function prepare_wlan_interfaces_html(select_class, aria_label, selected) {
    // TODO: This function needs to be absoleted in the future.
    let options = "";
    let interfaces = [];
    interfaces.push("none", get_wlan_interfaces());

    for(let x of interfaces) {
        if(selected.toString().trim() === x.toString().trim()) {
            options += `<option selected value="${x}">${x}</option>`
        } else {
            options += `<option value="${x}">${x}</option>`
        }
    }

    let res = `<select class="${select_class}" aria-label="${aria_label}">${options}</select>\n`;

    return res;
}


/**
 * Retrieve the current Wi-Fi interface from the config.
 * @returns {string} Current Wi-Fi interface.
 */
function get_wlan_interface() {
    const config  = require("./config");
    let config_json = config.read_default_config();
    return config_json.wlan_interface;
}


/**
 * Save the current Wi-Fi interface in the configuration.
 * @param {string} iface - 802.11 interface.
 * @returns {boolean}: true on success, and false on failure.
 */
function set_wlan_interface(iface) {
    const config = require("./config");
    let config_json = config.read_default_config();
    config_json.wlan_interface = iface;
    config.write_default_config(config_json);
    return true;
}

module.exports = {
    get_wlan_interfaces,
    prepare_wlan_interfaces_html,
    get_wlan_interface,
    set_wlan_interface
};