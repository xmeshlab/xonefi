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

// Performs a quick check whether UUID is used
function hz_uuid_unique(uuid_str, used_uuids) {
    if(used_uuids.includes(uuid_str)) {
        return false;
    }

    return true;
}

// Performs a quick check whether session UUID is used
function hz_session_uuid_unique(uuid_str, used_uuids) {
    if(used_uuids) {
        if(used_uuids.includes(uuid_str)) {
            return false;
        }
    }
    return true;
}

module.exports = { hz_uuid_unique, hz_session_uuid_unique };
