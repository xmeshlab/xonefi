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
 * Return the ERC20 token balance of the current account measured in OFI.
 * @param {function(int)} callback - OFI balance of the current account or -1 if error occurs.
 */
function get_account_balance(callback) {
    var Web3 = require('web3');
    const infura = require("./infura");
    const bnetwork = require("./bnetwork");
    const contract = require("./contract");
    const config = require("./config");

    bnetwork.get_bnetwork_db((net) => {
        var id = infura.get_infura_id();
        var web3 = new Web3("wss://" + net + ".infura.io/ws/v3/" + id);
        var config_json = config.read_default_config();
        var contract_config_json = contract.get_current_contract_config_json();
        if(config_json.account_set) {
            var myContract = new web3.eth.Contract(contract_config_json.contract_abi, contract_config_json.smart_contract);
            myContract.methods.balanceOf(config_json.account.address).call({from: config_json.account.address}, function (error, result) {
                return callback(result * Math.pow(10, -12));
            });
        }
    });

    return callback(-1);
}

module.exports = { get_account_balance };
