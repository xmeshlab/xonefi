/*
SPDX-License-Identifier: GPL-3.0-or-later

Copyright (c) 2019-2022 XOneFi <https://onefi.io>

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
 * Call OneFi provider to request session handover.
 * @param {string} ip - IP address of OneFi AP.
 * @param {int} port - UDP port of OneFi AP.
 * @param {Web3} web3 - Web3 object. Will be obsoleted in the future.
 * @param {string} prk - Client private key.
 * @param {string} session - UUID of the current session.
 * @param {Object} sackok - Most recent SACK-OK JSON response from OneFi provider (proof of session).
 * @param {function} callback - Return status: true - success, false - failure.
 */
function call_handover(ip, port, web3, prk, session, sackok, callback) {
    const uuid = require('uuid');
    var message = {};

    let pubaddress = web3.eth.accounts.privateKeyToAccount(prk).address;

    message.command = {};
    message.command.op = "HANDOVER";
    message.command.from = pubaddress;
    msg_uuid = uuid.v4().toString();
    message.command.uuid = msg_uuid;
    message.command.timestamp = Math.floor(new Date() / 1000);
    message.command.session = session;
    message.command.re = "";
    message.command.arguments = sackok;

    var signature_json = web3.eth.accounts.sign(
        JSON.stringify(message.command),
        prk
    );

    message.signature = signature_json.signature;

    const send_udp = require('./send_udp');
    send_udp.send_udp2(ip, port, JSON.stringify(message), (result) => {
        return callback(result);
    });
}

module.exports = { call_handover };