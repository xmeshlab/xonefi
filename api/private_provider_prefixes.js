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
 * Extract from configuration/state the 10-hex-digit prefixes of private (restricted) providers.
 * @param {Object} config_json - JSON object of the current configuration/state.
 * @returns {array} Array of prefixes corresponding to private providers.
 */
function get_private_provider_prefixes(config_json) {
    let prefixes = [];

    for(let x of config_json.private_providers) {
        prefixes.push(x.substr(2, 10).toLowerCase());
    }

    return prefixes;
}

module.exports = { get_private_provider_prefixes };