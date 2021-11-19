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
 * Create a serialized SACK string for passing to the OneFi smart contract's claim() function.
 * @param {string} client - Ethereum address of the client.
 * @param {string} hotspot - Ethereum address of the provider.
 * @param {string} amount - amount of OFI (OneFi tokens/points) that the hotspot (provider) can claim (cash).
 * @param {int} timestamp - current timestamp (granularity - seconds)
 * @param {string} prk - private key of the client.
 * @returns {string} Serialized SACK string that is understood by the smart contract's claim() function. Refer to
 * EVM/Solidity ABI encoding for more information about the serialization.
 */
function encode_sack(client, hotspot, amount, timestamp, prk) {
    var Web3 = require("web3");
    var web3 = new Web3();

    let f0 = "S";
    let f1 = client.toLowerCase().substr(2);
    let f2 = hotspot.toLowerCase().substr(2);
    let f3 = amount.toString(16).padStart(64, "0");
    let f4 = timestamp.toString(16).padStart(8, "0");

    let msg = f0 + f1 + f2 + f3 + f4;

    var hash = web3.utils.soliditySha3(
        {t: 'bytes', v: '0x53'},
        {t: 'address', v: client},
        {t: 'address', v: hotspot},
        {t: 'uint256', v: amount.toString()},
        {t: 'uint32', v: timestamp}
    );

    var signature = web3.eth.accounts.sign(
        hash,
        prk
    );

    return signature.signature;
}

module.exports = { encode_sack };