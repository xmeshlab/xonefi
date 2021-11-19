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
 * Get the path to the OneFi Client PID file. This file stores the PID of the currently running OneFi Client PID.
 * @returns {string} PID file path.
 */
function get_client_pid_path() {
    const homedir = require('os').homedir();
    const path = require('path');
    return path.join(homedir, ".onefi-client.pid");
}


/**
 * Get the path to the OneFi Provider PID file. This file stores the PID of the currently running OneFi Provider PID.
 * @returns {string} PID file path.
 */
function get_provider_pid_path() {
    const homedir = require('os').homedir();
    const path = require('path');
    return path.join(homedir, ".onefi-provider.pid");
}


/**
 * Obtain the PID (process ID) of the current process.
 * @returns {int} PID of the current process on success; -1 on failure.
 */
function get_current_pid() {
    // TODO: Test this function on MAC
    // TODO: Test this function on Windows.
    const process = require("process");
    if (process.pid) {
        return process.pid;
    }

    return -1;
}


/**
 * Save the PID of the current process in a file.
 * @param {string} pid_file - the absolute or relative path to the file where the PID will be stored
 * @returns {boolean} true on success, and false on failure.
 */
function save_pid(pid_file) {
    // TODO: Test this function on MAC
    // TODO: Test this function on Windows.
    const fs = require("fs");

    try {
        fs.writeFileSync(pid_file, get_current_pid().toString());
    } catch(e) {
        console.log(`ERROR [e622a9f9b7]: ${e}`);
        return false;
    }

    return true;
}

module.exports = { get_client_pid_path, get_provider_pid_path, get_current_pid, save_pid };
