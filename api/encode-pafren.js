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
 * Serialize PAFREN into a proof string recognized by OneFi smart contract's freeze() method.
 * @param {string} client - Ethereum address of the client.
 * @param {string} hotspot - Ethereum address of the hotspot.
 * @param {string} amount - amount of OneFi points (OFI tokens) to freeze. NOTE: it must be string to avoid overflow.
 * @param {int} timestamp - PAFREN expiration timestamp
 * @param {string} prk - client private key
 * @returns {string} - encoded PAFREN proof for sending over to the smart contract.
 */
function encode_pafren(client, hotspot, amount, timestamp, prk) {
    var Web3 = require("web3");
    var web3 = new Web3();

    console.log(`Private key: ${prk}`);

    let f0 = "P";
    let f1 = client.toLowerCase().substr(2);
    let f2 = hotspot.toLowerCase().substr(2);
    let f3 = amount.toString(16).padStart(64, "0");
    let f4 = timestamp.toString(16).padStart(8, "0");

    let msg = f0 + f1 + f2 + f3 + f4;

    console.log(`=DEB1(`);
    console.log(`client: ${client}`);
    console.log(`hotspot: ${hotspot}`);
    console.log(`amount: ${amount}`);
    console.log(`timestamp: ${timestamp}`);
    console.log(`)DEB=`);

    var hash = web3.utils.soliditySha3(
        {t: 'bytes', v: '0x50'},
        {t: 'address', v: client},
        {t: 'address', v: hotspot},
        {t: 'uint256', v: amount.toString()},
        {t: 'uint32', v: timestamp}
    );

    var signature = web3.eth.accounts.sign(
        hash,
        prk
    );

    console.log(`MESSAGE: ${signature.message}`);
    console.log(`****MSG: ${msg}`);

    return signature.signature;
}

module.exports = { encode_pafren };