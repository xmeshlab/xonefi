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

const { symlinkSync } = require('fs');

/**
 * Call OneFi provider to request a new session.
 * @param {string} ip - IP address of OneFi AP.
 * @param {int} port - UDP port of OneFi AP.
 * @param {Web3} web3 - Web3 object. Will be obsoleted in the future.
 * @param {string} prk - Client private key.
 * @param {string} session - UUID of the current session.
 * @param {function} callback - Return status: true - success, false - failure.
 */
function call_hello(ip, port, web3, prk, session, callback) {
    var uuid = require('uuid');
    
    var message = new Object();

    let pubaddress = web3.eth.accounts.privateKeyToAccount(prk).address;

    message.command = new Object();
    message.command.op = "HELLO";
    message.command.from = pubaddress;
    msg_uuid = uuid.v4().toString();
    message.command.uuid = msg_uuid;
    message.command.timestamp = Math.floor(new Date() / 1000);
    message.command.session = session;
    message.command.re = "";
    message.command.arguments = new Object();
    
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

/**
 * Integration testing helper for call_hello()
 * @param {function} callback - Return status: true - success, false - failure.
 */
function test_call_hello(callback) {
    var Web3 = require('web3');                 // Library to work with Etheretum smart contracts
    var web3 = new Web3();
    prk = "0x005ecd7e51cd560f02441ce768996ed2714907f05c29ac5125f07df0feb087fa";
    session = "bd81cf9e-2d20-438a-bc1c-a25be2df55c9";

    call_hello("127.0.0.1", "3141", web3, prk, session, (ret) => {
        return callback(ret);
    });
}

module.exports = { call_hello, test_call_hello };