/*
SPDX-License-Identifier: GPL-3.0-or-later

Copyright (c) 2019-2023 XOneFi <https://onefi.io>

XOneFi is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

XOneFi Router is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with XOneFi Router.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * Updates the counter in update.dat of the specified router of the specified provider.
 * @param {string} provider_prefix - The 10-digit hexadecimal identifier of the provider (which is the first 10
    lowercase digits of the provider's public address.
 * @param {string} router_no - Router number of the given provider.
 * @returns {boolean} True if success, false otherwise.
 */
function increment_update_counter(provider_prefix, router_no) {
    const fs = require('fs');

    fs.readFile(`/var/www/html/${provider_prefix}/${router_no}/update.dat`, 'utf8', (err, data) => {
        if(err) {
            return false;
        }

        let intValue = parseInt(data, 10);

        if (isNaN(intValue)) {
            return false;
        }

        intValue++;

        fs.writeFile(`/var/www/html/${provider_prefix}/${router_no}/update.dat`, `${intValue}`, 'utf8', (err) => {
            if(err) {
                return false;
            }

            return true;
        });
    });
    return true;
}

module.exports = {
    increment_update_counter
};