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

hotspot_type = require("../api/hotspot-type");

calculated_hostpost_type = hotspot_type.calculate_hotspot_type(true);

console.log(`Calculated Hotspot Type: ${calculated_hostpost_type}`);
console.log(`Decoded Hotspot Type: ${JSON.stringify(hotspot_type.decode_hotspot_type(calculated_hostpost_type))}`);
