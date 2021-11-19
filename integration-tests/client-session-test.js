/*
SPDX-License-Identifier: GPL-3.0-or-later

Copyright (c) 2020-2021 OneFi <https://onefi.io>

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

const client_session = require("../api/client_session");

client_session.set_client_session(
    {
        status: 0,
        ssid: "",
        ip: "",
        "port": 0,
        "prefix": "",
        "pfd": false,
        "pft": false,
        "free": false,
        "restricted": false,
        "sack_number": 0
    }
);

let session_json = client_session.get_client_session();

console.log(`SESSION: ${JSON.stringify(session_json)}`);