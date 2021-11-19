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
 * Get the path to the consolidated OneFi log file. UI, client, and provider route their logs into
 * the same file (a.k.a., "onefi.log").
 * @returns {string} Log file path.
 */
function get_log_path() {
    const homedir = require('os').homedir();
    const path = require('path');
    return path.join(homedir, ".onefi.log");
}

/**
 * Log a message in OneFi log file. This function is to be used in environments, such as Electron, where console.log()
 * cannot produce stdout output for redirection to onefi.log.
 * @param {string} msg - message to log.
 * @returns {boolean} true: success, false: failure.
 */
function log(msg) {
    var fs = require('fs');
    // TODO: get rid of n.
    var n = fs.appendFileSync(get_log_path(), `${msg}\n`);
        
    if(n <= 0) {
        return false;
    }

    return true;
}

module.exports = { log, get_log_path };