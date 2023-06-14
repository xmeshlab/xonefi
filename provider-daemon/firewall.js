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

// TODO: Discuss whether IPs or MACs (or both) should be filtered. Implement changes, if any, based on the discussion results.
function update_internet_restrictions(ipids, table_type="ebtables") {
    const e2e = require("../api/e2e_mode");
    const exec = require('child_process').exec;   // Needed to call the firewall

    // Currently, supports only ebtables (OpenWrt)
    // TODO: Implement iptables
    if(e2e.get_e2e_status() === false){ // Linux Ethernet bridge firewalling, like iptables
        // exec("sudo ebtables -F", // Flush the selected chain. If no chain is selected, then every chain will beflushed.
        //     function (error, stdout, stderr) {
        //         // console.log('stdout: ' + stdout);
        //         // console.log('stderr: ' + stderr);
        //         if (error !== null) {
        //             console.log('exec error: ' + error);
        //         }
        //     });

        console.log("Executing firewall rules");

        for(let ipid of ipids) {
            console.log("NEXT IPID: " + ipid);
            console.log("Executing/adding firewall rule.");
            //console.log(`EXEC STRING: sudo ebtables -A FORWARD -p IPv4 --ip-source ${ip} -j DROP`);
            // exec(`sudo ebtables -A FORWARD -p IPv4 --ip-source ${ip} -j DROP`,
            //     function (error, stdout, stderr) {
            //         // console.log('stdout: ' + stdout);
            //         // console.log('stderr: ' + stderr);
            //         if (error !== null) {
            //             console.log('exec error: ' + error);
            //         }
            //     });
        }
    } else {
        console.log("Executing firewall rules");

        // exec("sudo ebtables -F", // Flush the selected chain. If no chain is selected, then every chain will beflushed.
        //     function (error, stdout, stderr) {
        //         // console.log('stdout: ' + stdout);
        //         // console.log('stderr: ' + stderr);
        //         if (error !== null) {
        //             console.log('exec error: ' + error);
        //         }
        //     });


        for(let ipid of ipids) {
            console.log("NEXT IPID: " + ipid);
            console.log("Adding firewall rule.");
            //console.log(`EXEC STRING: sudo ebtables -A FORWARD -p IPv4 --ip-source ${ip} -j DROP`);
            // exec(`sudo ebtables -t filter -A FORWARD -p IPv4 --ip-source ${ip} -j DROP`,
            //     function (error, stdout, stderr) {
            //         if (error !== null) {
            //             console.log('exec error: ' + error);
            //         }
            //     });
        }
    }

}

module.exports = { update_internet_restrictions };
