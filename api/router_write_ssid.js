/*
SPDX-License-Identifier: GPL-3.0-or-later

Copyright (c) 2019-2023 XOneFi

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


function write_ssid(provider_prefix, router_no, policy) {
    const fs = require('fs');

    console.log(`calling write_ssid(): provider_prefix=${provider_prefix}, router_no=${router_no}, ssid=${policy}`);
    let policy_filename = `/var/www/html/${provider_prefix}/${router_no}/ssid.fw`;

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
    write_ssid
};