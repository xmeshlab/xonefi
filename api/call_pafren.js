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
 * Call OneFi provider to provide partial freeze endorsement (PAFREN) of the tokens in the smart contract.
 * @param {string} ip - IP address of OneFi AP.
 * @param {int} port - UDP port of OneFi AP.
 * @param {Web3} web3 - Web3 object. Will be obsoleted in the future.
 * @param {string} prk - Client private key.
 * @param {string} session - UUID of the current session.
 * @param {string} re - UUID of the message that this message replies to.
 * @param {string} amount - Number of OFI points endoresed to freeze by the PAFREN.
 * NOTE: Use string instead of int here to avoid overflow.
 * @param {int} exp_timestamp - UNIX timestamp (with seconds precision/granularity) of the PAFREN expiration.
 * @param {string} pafren - Serialized PAFREN. Please see encode_sack() for generation thereof.
 * @param {function} callback - Return status: true - success, false - failure.
 */
function call_pafren(ip, port, web3, prk, session, re, amount, exp_timestamp, pafren, callback) {
    var uuid = require('uuid');

    var message = {};

    let pubaddress = web3.eth.accounts.privateKeyToAccount(prk).address;
    message.command = new Object();
    message.command.op = "PAFREN";
    message.command.from = pubaddress;
    msg_uuid = uuid.v4().toString();
    message.command.uuid = msg_uuid;
    message.command.timestamp = exp_timestamp;
    message.command.session = session;
    message.command.re = "";
    message.command.arguments = {};
    message.command.arguments.pafren = {
        client: pubaddress,
        amount: amount,
        timestamp: exp_timestamp,
        proof: pafren
    };

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

module.exports = { call_pafren };