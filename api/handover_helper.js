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
 * Determine if two OneFi SSIDs are eligible for session handover.
 * @param {string} ssid1 - source SSID
 * @param {string} ssid2 - destinatin SSID
 * @returns {boolean} true if eligible, false otherwise.
 */
function handover_match(ssid1, ssid2) {
    const ssid = require("./ssid");

    let dssid1 = ssid.deserialize_ssid(ssid1);
    let dssid2 = ssid.deserialize_ssid(ssid2);

    let pref1 = dssid1.prefix;
    let pref2 = dssid2.prefix;

    let type1 = dssid1.hotspot_type;
    let type2 = dssid2.hotspot_type;

    let cost1 = dssid1.cost;
    let cost2 = dssid2.cost;

    let pafren1 = dssid1.pafren;
    let pafren2 = dssid2.pafren;

    if(ssid1 !== ssid2) {
        return pref1 === pref2 && type1 === type2 && cost1 === cost2 && pafren1 === pafren2;
    }

    return false;
}

module.exports = { handover_match };