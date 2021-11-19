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

const ssid = require("../api/ssid");

let ssid_json = ssid.compile_ssid_json(
      0,
    200,
    17,
    12,
    "192.168.0.3",
    5200,
    25,
    64000,
    "87215c424b"
);

let serialized_ssid = ssid.serialize_ssid(ssid_json);

console.log(serialized_ssid);

let deserialized_ssid = ssid.deserialize_ssid(serialized_ssid);

console.log(JSON.stringify(deserialized_ssid));
