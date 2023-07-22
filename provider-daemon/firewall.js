/*
SPDX-License-Identifier: GPL-3.0-or-later

Copyright (c) 2019-2021 XOneFi

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

const firewall_rules = require('../api/firewall_rules');
const fw_update_counter = require('../api/fw_update_counter');
const fw_write_policy = require('../api/fw_write_policy');
const {router} = require("express/lib/application");


function update_internet_restrictions(ipids) {
    console.log("Executing firewall rules");

    let rules_combined = new Map();

    for(let ipid of ipids) {
        console.log("NEXT IPID: " + ipid);
        console.log("Executing/adding firewall rule.");

        let sp = ipid.split(";");
        let prefix = sp[0];
        let router_no = sp[1];
        let ip = sp[2];

        let rule = firewall_rules.generate_restriction_rule(ip, "137.184.213.75");
        console.log(`RULE:\n${rule}\n`);

        let update_count = fw_update_counter.increment_update_counter(prefix, router_no);
        console.log(`increment_update_counter result: ${update_count}`);

        let router_id = `${prefix};${router_no}`;
        if(rules_combined.has(router_id)) {
            console.log(`True branch`);
            rules_combined.set(router_id, rules_combined.get(router_id) + rule + "\n\n");
        } else {
            console.log(`False branch`);
            rules_combined.set(router_id, rule + "\n\n");
        }
    }

    console.log(`Rules combined: ${JSON.stringify(rules_combined)}`);

    let res = true;
    // res &= fw_write_policy.write_firewall_policy(pref, rno, "");
    for(let [key, value] of rules_combined) {
        console.log(`Processing pair: ${key}, ${value}`);
        let spp = key.split(";");
        let pref = spp[0];
        let rno = spp[1];
        console.log(`pref: ${pref}, rno: ${rno}, value: ${value}`);
        res &= fw_write_policy.write_firewall_policy(pref, rno, value);
    }

    console.log(`res: ${res}`);

    return res;
}

module.exports = { update_internet_restrictions };