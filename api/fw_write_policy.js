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
 * Save the second part of the firewall policy into the corresponding policy.fw file.
 * @param {string} provider_prefix - The 10-digit hexadecimal identifier of the provider (which is the first 10
 lowercase digits of the provider's public address.
 * @param {string} router_no - Router number of the given provider.
 * @param {string} policy - The fleeting (second part) firewall policy.
 * @returns {boolean} True if success, false otherwise.
 */
function write_firewall_policy(provider_prefix, router_no, policy) {
    const fs = require('fs');

    let policy_filename = `/var/www/html/${provider_prefix}/${router_no}/policy.fw`;

    fs.truncate(policy_filename, 0, function(err) {
        if (err) {
            return false;
        }

        fs.writeFile(policy_filename, policy, 'utf8', (err) => {
            if (err) {
                return false;
            }

            return true;
        });
    });
}

module.exports = {
    write_firewall_policy
};