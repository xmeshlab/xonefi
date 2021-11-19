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
 * Session status.
 * @type {{SLEEP: number, ACTIVE: number, CLOSED: number, UNDEFINED: number, EXPIRED: number, HANDSHAKE: number, SCAN: number}}
 */
const status = {
    UNDEFINED:  0,          // pre-session status
    HANDSHAKE:  1,          // handshake stage
    ACTIVE:     2,          // active session
    SLEEP:      3,          // client did not provide SACK by deadline
    EXPIRED:    4,          // PAFREN expiration time reached
    CLOSED:     5,          // the session has been properly closed
    SCAN:       6,          // Scanning for SSIDs Stage
}

module.exports = { status };