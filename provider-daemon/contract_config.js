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

function get_contract_config_json(config_json_new) {
    const fs = require('fs');                       // Needed to access files on the filesystem.

    let contract_file = "";

    if(config_json_new.network === "goerli") {
        contract_file = "../contract-goerli.json";
    }

    if(config_json_new.network === "kovan") {
        contract_file = "../contract-kovan.json";
    }

    if(config_json_new.network === "mainnet") {
        contract_file = "../contract-mainnet.json";
    }

    if(config_json_new.network === "goerli") {
        contract_file = "../contract-goerli.json";
    }


    //console.log(`@DEBUG @get_contract_config_json contract_file: ${contract_file}`);
    let rawdata = "";

    try{
        rawdata = fs.readFileSync(contract_file);     // Read the contract configuration file.
    }
    catch{
        console.log("Could not open contract configuration file.");
    }

    //console.log(`@DEBUG @get_contract_config_json rawdata: ${rawdata}`);

    try{
        return JSON.parse(rawdata); // Parse the smart contract configuration in a JSON object.
    } catch {
        console.log("Could not parse the data into JSON.");
        return "";
    }
}

module.exports = { get_contract_config_json };