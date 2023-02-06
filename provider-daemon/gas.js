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

function get_gas_offer(config_json_new) {

    var gas_offer = 0;

    if(config_json_new.network === "goerli") {
        gas_offer = config_json_new.gas_offer.goerli;
    }

    if(config_json_new.network === "kovan") {
        gas_offer = config_json_new.gas_offer.kovan;
    }

    if(config_json_new.network === "mainnet") {
        gas_offer = config_json_new.gas_offer.mainnet;
    }

    console.log(`GAS OFFER TEST: ${gas_offer}`);

    return gas_offer;
}

function get_gas_price(config_json_new) {

    var gas_price = 0;

    if(config_json_new.network === "goerli") {
        gas_price = config_json_new.gas_price.goerli;
    }

    if(config_json_new.network === "kovan") {
        gas_price = config_json_new.gas_price.kovan;
    }

    if(config_json_new.network === "mainnet") {
        gas_price = config_json_new.gas_price.mainnet;
    }

    console.log(`GAS OFFER TEST: ${gas_price}`);

    return gas_price;
}

module.exports = { get_gas_offer, get_gas_price };