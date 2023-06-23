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
 * Generate a rule for OpenWrt firewall that blocks Internet for a client, except for access to XMesh cloud.
 * @param {string} client_ip - Client IP.
 * @param {string} cloud_ip - Cloud IP.
 * @returns {string} A rule to add to /etc/config/firewall on the router (which runs OpenWrt).
 */
function generate_restriction_rule(client_ip, cloud_ip) {
    res = "config rule\n";
    res += "\toption src\tlan\n";
    res += `\toption src_ip\t${client_ip}\n`;
    res += `\toption dest_ip\t!${cloud_ip}\n`;
    res += `\toption dest\twan\n`;
    res += `\toption proto\tall\n`;
    res += `\toption REJECT\n`;
    return res;
}

module.exports = {
    generate_restriction_rule
};