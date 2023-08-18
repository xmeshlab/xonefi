/*
SPDX-License-Identifier: GPL-3.0-or-later

Copyright (c) 2019-2023 XOneFi

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

function insert_session(
    config_json,
    SessionID,
    HandshakeDueTimestamp,
    ProviderSSID,
    ProviderRouterNumber,
    ProviderIPAddress,
    ProviderPort,
    ProviderPublicAddress,
    ProviderAccountBalanceBeforeSession,
    ProviderAccountBalanceAfterSession,
    ProviderPricePerHour,
    ClientStartSessionTime,
    ClientStopSessionTime,
    ClientUsageTime,
    ClientPublicAddress,
    ClientAccountBalanceBeforeSession,
    ClientAccountBalanceAfterSession,
    AverageDownloadSpeed,
    AverageUploadSpeed
) {
    const pgp = require('pg-promise')();

    const connection = {
        host: 'localhost',
        port: 54320,
        database: 'postgres',
        user: 'postgres',
        password: config_json.db.password
    };

    const db = pgp(connection);

    let dehyphenated_session_id = SessionID.replace(/-/g, '');
    if(dehyphenated_session_id > 32) {
        dehyphenated_session_id = dehyphenated_session_id.substring(0, 32);
    }

    const query = `INSERT INTO sessions (
        SessionID,
        HandshakeDueTimestamp,
        ProviderSSID,
        ProviderRouterNumber,
        ProviderIPAddress,
        ProviderPort,
        ProviderPublicAddress,
        ProviderAccountBalanceBeforeSession,
        ProviderAccountBalanceAfterSession,
        ProviderPricePerHour,
        ClientStartSessionTime,
        ClientStopSessionTime,
        ClientUsageTime,
        ClientPublicAddress,
        ClientAccountBalanceBeforeSession,
        ClientAccountBalanceAfterSession,
        AverageDownloadSpeed,
        AverageUploadSpeed
    ) VALUES (
        '${dehyphenated_session_id}',
        '${HandshakeDueTimestamp}',
        '${ProviderSSID}',
        ${ProviderRouterNumber},
        '${ProviderIPAddress}',
        ${ProviderPort},
        '${ProviderPublicAddress}',
        ${ProviderAccountBalanceBeforeSession},
        ${ProviderAccountBalanceAfterSession},
        ${ProviderPricePerHour},
        '${ClientStartSessionTime}',
        '${ClientStopSessionTime}',
        '${ClientUsageTime}',
        '${ClientPublicAddress}',
        ${ClientAccountBalanceBeforeSession},
        ${ClientAccountBalanceAfterSession},
        ${AverageDownloadSpeed},
        ${AverageUploadSpeed}
    );`;
    
    db.none(query)
      .then(() => {
        console.log('Row added successfully.');
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });
}

function unix_timestamp_to_iso_string(unix_timestamp) {
    let date = new Date(unix_timestamp * 1000);
    return date.toISOString();
}

function insert_session_test(config_json) {
    const uuid = require('uuid');
    let session_id = uuid.v4().toString();

    let current_unix_timestamp = Math.floor(new Date() / 1000);

    insert_session(
        config_json,
        session_id,
        unix_timestamp_to_iso_string(current_unix_timestamp + 70),
        'testSSID',
        100,
        '192.168.1.1',
        80,
        '0x11111111222222223333333344444444',
        1000,
        900,
        5,
        unix_timestamp_to_iso_string(current_unix_timestamp),
        unix_timestamp_to_iso_string(current_unix_timestamp + 3600),
        '1 hour',
        '0xaaaaaaaabbbbbbbbccccccccdddddddd',
        500,
        400,
        50,
        10
    );
}

module.exports = {
    insert_session,
    insert_session_test
};