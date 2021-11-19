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

const encode_pafren = require("../api/encode-pafren");

let pafren = encode_pafren.encode_pafren(
    "0x0221B57Cc38C0360f1CAf638e1671243870C0424",
    "0x018D1B88ef8F5E56Ab943D724afE1B93B0B96935",
    7900 * Math.pow(10, 12),
    1621812587,
    "0xc6c6e65b7a45f281c2a93a9e1bf6d7e705e79dd5aa5df32b122e95fb4d122e28"
);

console.log(`ENCODED PAFREN: ${pafren}`);


let pafren1 = encode_pafren.encode_pafren(
    "0x0221B57Cc38C0360f1CAf638e1671243870C0424",
    "0x018D1B88ef8F5E56Ab943D724afE1B93B0B96935",
    7900 * Math.pow(10, 12),
    1621812587,
    "0xc6c6e65b7a45f281c2a93a9e1bf6d7e705e79dd5aa5df32b122e95fb4d122e28"
);


console.log(`ENCODED PAFREN1: ${pafren1}`);
