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

function saveLastSacks(session_last_sacks) {
    const data_file = "last_sacks.dat";
    const fs = require('fs');
    var serialized = "";
    for (const [key, value] of session_last_sacks.entries()) {
        serialized = `##${key}&&${value}`
    }
    serialized = serialized.substring(2);

    try {
        fs.writeFileSync(data_file, serialized);
    } catch (err) {
        console.error(err)
    }
}

function restoreLastSacks(session_last_sacks) {
    const data_file = "last_sacks.dat";
    const fs = require('fs');
    session_last_sacks = new Map();
    var raw_data = "";
    if (fs.existsSync("last_sacks.dat")) {
        try {
            raw_data = fs.readFileSync(data_file, 'utf8');
        } catch (err) {
            console.log("ERROR" + err);
        }
    }

    var chunks = raw_data.split("##");
    for(item in chunks) {
        var pair = item.split("&&");
        if(pair.length === 2) {
            session_last_sacks.set(pair[0], pair[1]);
        }
    }
}

module.exports = { saveLastSacks, restoreLastSacks };