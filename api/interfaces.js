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
 * Obtain the list of wireless interfaces.
 * @param callback - returns the list of interfaces.
 */
function get_interfaces(callback) {
    var iwconfig = require('wireless-tools/iwconfig');
 
    iwconfig.status(function(err, status) {
        var lst = [];

        for(x of status) {
            lst.push(x.interface);
        }

        return callback(lst);
    });
}

module.exports = { get_interfaces };