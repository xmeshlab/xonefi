/*
SPDX-License-Identifier: GPL-3.0-or-later

Copyright (c) 2020-2022 XOneFi <https://onefi.io>

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

var global_counter = 0;
const ssid = require("../api/ssid");
const fhs = require("../api/fast_hotspot_selection");
const client_session = require("../api/client_session");
const session_status = require("../api/session-status");
const timestamp = require("../api/timestamp");
const symcrypto = require("../api/symcrypto");
const uuid = require("../api/uuid");
const hotspot_type = require("../api/hotspot-type");
const scan_counter = require("../api/scan_counter");
const config = require("../api/config");
const sack_timestamp = require("../api/sack-timestamp");
const wifi_connect = require("../api/wifi-connect");
const call_hello = require("../api/call_hello");
const call_pafren = require("../api/call_pafren");
const call_handover = require("../api/call_handover");
const encode_pafren = require("../api/encode-pafren");
const call_sack = require("../api/call_sack");
const encode_sack = require("../api/encode-sack");
const sack_number = require("../api/sack_number");
const handover_helper = require("../api/handover_helper");
const sackok = require("../api/sackok");
const process_mgmt = require("../api/process_mgmt");

const worker = require("./worker");


const Web3 = require('web3');

if(!process_mgmt.save_pid(process_mgmt.get_client_pid_path())) {
    console.log(`ERROR: Unable to save PID of the current process.`);
    process.exit(1);
}

async function main() {
    config.config_init_if_absent();

    scan_counter.set_scan_counter(0);
    sack_number.set_sack_number(0);
    sack_number.set_initiated_sack_number(0);

    let config_json = config.read_default_config();

    if(process.argv.length < 3) {
        console.log("USAGE: node clientclient.js <PASSWORD>");
        return;
    }

    console.log("Dropping previous sessions");
    let session = config_json.client_session;
    session.status = session_status.status.CLOSED;
    client_session.set_client_session(session);

    let user_password  = process.argv[2];
    let decrypted_private_key = symcrypto.decrypt_aes256ctr(config_json.account.encrypted_prk, user_password);
    console.log(`decrypted prk: ${decrypted_private_key}`);

    while(true) {
        try {
            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch(e) {
            break;
        }

        config_json = config.read_default_config();

        console.log(`config_json: ${JSON.stringify(config_json)}`);

        if(config_json.client_on === true) {
            worker.client_worker(config_json, user_password, decrypted_private_key, () => {
                console.log(`${global_counter}: Client is on`);
            });
        } else {
            console.log(`${global_counter}: Client is off`);
        }

        global_counter++;
    }

}

main();



// function send_next_sack(config_json, user_password, private_key) {
//     console.log(`Calling send_next_sack() with config_json = ${JSON.stringify(config_json)}`);
//     let current_sack_amount = config_json.client_session.sack_amount * (config_json.client_session.sack_number + 1) * Math.pow(10, 12);
//
//     let session = config_json.client_session;
//     session.status = session_status.status.ACTIVE;
//     session.expiration_timestamp = config_json.client_session.pafren_timestamp;
//     session.sack_number = session.sack_number + 1;
//     client_session.set_client_session(session);
//
//     let current_timestamp = timestamp.get_current_timestamp();
//     sack_timestamp.set_last_sack_timestamp(current_timestamp);
//
//
//     call_sack.call_sack(
//         config_json.client_session.ip,
//         config_json.client_session.port,
//         new Web3(),
//         private_key,
//         config_json.client_session.session_id,
//         "",
//         current_sack_amount,
//         current_timestamp,
//         encode_sack.encode_sack(
//             config_json.account.address,
//             config_json.client_session.provider_address,
//             current_sack_amount,
//             current_timestamp,
//             private_key
//         ),
//         (response2) => {
//             console.log(`SACK SENT. RESPONSE2: ${response2}`);
//
//             let response2_json = {};
//
//             try {
//                 response2_json = JSON.parse(response2);
//
//                 if(response2_json.command.arguments.answer === "SACK-OK") {
//                     console.log("SACK is accepted by provider! Active session continues.");
//                     sackok.set_sackok(response2_json);
//                     // let session = config_json.client_session;
//                     // session.status = session_status.status.ACTIVE;
//                     // session.expiration_timestamp = config_json.client_session.pafren_timestamp;
//                     // session.sack_number = session.sack_number + 1;
//                     // client_session.set_client_session(session);
//                     // sack_timestamp.set_last_sack_timestamp(response2_json.command.timestamp);
//                 }
//             } catch(e) {
//                 console.log(`ERROR[be6da098a5]: unable to parsej JSON: ${e}`);
//             }
//         });
// }


// function initiate_handover(deserealized_ssid, chosen_ssid, user_password, private_key, config_json) {
//     console.log(`Handing the session over to: ${JSON.stringify(deserealized_ssid)}`);
//     console.log(`Handover chosen_ssid: ${chosen_ssid}`);
//
//     wifi_connect.wifi_connect(chosen_ssid, (res) => {
//         if(res) {
//             console.log(`Successfully connected to ${deserealized_ssid.ssid}`);
//             console.log(`Initiating the handover stage`);
//
//             let hotspot_type_json = hotspot_type.decode_hotspot_type(deserealized_ssid.hotspot_type);
//
//             let calculated_sack_amount;
//
//             console.log(`DEB2@hotspot_type_json.access_method: ${hotspot_type_json.access_method}`);
//             console.log(`DEB2@deserealized_ssid.cost: ${deserealized_ssid.cost}`);
//
//             if(hotspot_type_json.access_method === "pft") {
//                 calculated_sack_amount = deserealized_ssid.cost / 60;
//             } else if(hotspot_type_json.access_method === "pfd") {
//                 calculated_sack_amount = deserealized_ssid.cost / 64;
//             } else if(hotspot_type_json.access_method === "restricted") {
//                 calculated_sack_amount = 0;
//             } else if(hotspot_type_json.access_method === "free") {
//                 calculated_sack_amount = 0;
//             } else {
//                 console.log(`ERROR: Unknown access type: ${hotspot_type_json.access_method}`);
//                 return;
//             }
//
//             console.log(`DEB2@calculated_sack_amount: ${calculated_sack_amount}`);
//
//             let calculated_pafren_amount;
//
//             if(hotspot_type_json.access_method === "pft") {
//                 calculated_pafren_amount = deserealized_ssid.cost * deserealized_ssid.pafren * 0.01 * 60;
//             } else if(hotspot_type_json.access_method === "pfd") {
//                 calculated_pafren_amount = deserealized_ssid.cost * deserealized_ssid.pafren * 0.01 * 64;
//             } else if(hotspot_type_json.access_method === "restricted") {
//                 calculated_pafren_amount = 0;
//             } else if(hotspot_type_json.access_method === "free") {
//                 calculated_pafren_amount = 0;
//             } else {
//                 console.log(`ERROR: Unknown access type: ${hotspot_type_json.access_method}`);
//                 return;
//             }
//
//             console.log(`hotspot_type_json.access_method: ${hotspot_type_json.access_method}`);
//
//             let calculated_number_of_sacks;
//
//             // if(hotspot_type_json.access_method === "pft" || hotspot_type_json.access_method === "pfd") {
//             //     calculated_number_of_sacks = calculated_pafren_amount / calculated_sack_amount;
//             // } else {
//             //     calculated_number_of_sacks = 0;
//             // }
//
//             if(hotspot_type_json.access_method === "pft") {
//                 calculated_number_of_sacks = calculated_pafren_amount / (calculated_sack_amount * 60);
//             } else if(hotspot_type_json.access_method === "pfd") {
//                 calculated_number_of_sacks = calculated_pafren_amount / (calculated_sack_amount * 64);
//             } else if(hotspot_type_json.access_method === "restricted") {
//                 calculated_number_of_sacks = 0;
//             } else if(hotspot_type_json.access_method === "free") {
//                 calculated_number_of_sacks = 0;
//             } else {
//                 console.log(`ERROR: Unknown access type: ${hotspot_type_json.access_method}`);
//                 return;
//             }
//
//             let pafren_length;
//
//             if(hotspot_type_json.access_method === "pft") {
//                 pafren_length = calculated_number_of_sacks * 60;
//             } else if(hotspot_type_json.access_method === "pfd") {
//                 pafren_length = 3600 * 24; // User has 24 hours to spend 1 GB. TODO: Change in future protocols.
//             } else if(hotspot_type_json.access_method === "restricted") {
//                 pafren_length = 0;
//             } else if(hotspot_type_json.access_method === "free") {
//                 pafren_length = 0;
//             } else {
//                 console.log(`ERROR: Unknown access type: ${hotspot_type_json.access_method}`);
//                 return;
//             }
//
//             client_session.set_client_session(
//                 {
//                     status: session_status.status.HANDSHAKE,
//                     ssid: chosen_ssid,
//                     ip: deserealized_ssid.ip,
//                     port: deserealized_ssid.port,
//                     prefix: deserealized_ssid.prefix,
//                     pfd: hotspot_type_json.access_method === "pfd",
//                     pft: hotspot_type_json.access_method === "pft",
//                     free: hotspot_type_json.access_method === "free",
//                     restricted: hotspot_type_json.access_method === "restricted",
//                     sack_number: 0,
//                     expiration_timestamp: timestamp.get_current_timestamp() + config_json.handshake_time,
//                     cost: deserealized_ssid.cost,
//                     pafren_percentage: deserealized_ssid.pafren,
//                     sack_amount: calculated_sack_amount,
//                     pafren_amount: calculated_pafren_amount,
//                     number_of_sacks: calculated_number_of_sacks,
//                     initiated_sack_number: 0
//                 }
//             );
//
//             config_json = config.read_default_config();
//
//             console.log(`CLIENT SESSION: ${JSON.stringify(client_session.get_client_session())}`);
//             console.log(`Handover stage initiated.`);
//             console.log(`Saying HANDOVER to provider...`);
//
//             call_handover.call_handover(
//                 deserealized_ssid.ip,
//                 deserealized_ssid.port,
//                 new Web3(),
//                 private_key,
//                 config_json.client_session.session_id,
//                 config_json.client_session.sackok,
//                 (response) => {
//                     console.log(`PROVIDER'S RESPONSE: ${response}`);
//
//                     let response_json = {};
//
//                     try {
//                         response_json = JSON.parse(response);
//                     } catch (error) {
//                         console.log(`ERROR: Unable to parse JSON: ${error}`);
//                     }
//
//                     if(response_json.command.arguments.answer === "HANDOVER-OK") {
//                         let response_json = JSON.parse(response);
//
//                         let session = config_json.client_session;
//                         session.ssids = deserealized_ssid.ssid;
//                         session.provider_address = response_json.command.from;
//                         session.ip = deserealized_ssid.ip;
//                         session.port = deserealized_ssid.port;
//                         client_session.set_client_session(session);
//                     } else {
//                         console.log(`The provider is not ready to serve. Continue connecting.`);
//                     }
//                 }
//             );
//         } else {
//             console.log(`Unable to connect to ${deserealized_ssid.ssid}`);
//         }
//     });
// }

// function initiate_connection(deserealized_ssid, chosen_ssid, user_password, private_key, config_json) {
//     console.log(`Initiating connection to: ${JSON.stringify(deserealized_ssid)}`);
//
//     console.log(`chosen_ssid: ${chosen_ssid}`);
//
//     wifi_connect.wifi_connect(chosen_ssid, (res) => {
//         if(res) {
//             console.log(`Successfully connected to ${deserealized_ssid.ssid}`);
//
//             console.log(`Initiating the handshake stage`);
//
//             let hotspot_type_json = hotspot_type.decode_hotspot_type(deserealized_ssid.hotspot_type);
//
//             let calculated_sack_amount;
//
//             console.log(`DEB2@hotspot_type_json.access_method: ${hotspot_type_json.access_method}`);
//             console.log(`DEB2@deserealized_ssid.cost: ${deserealized_ssid.cost}`);
//
//             if(hotspot_type_json.access_method === "pft") {
//                 calculated_sack_amount = deserealized_ssid.cost / 60;
//             } else if(hotspot_type_json.access_method === "pfd") {
//                 calculated_sack_amount = deserealized_ssid.cost / 64;
//             } else if(hotspot_type_json.access_method === "restricted") {
//                 calculated_sack_amount = 0;
//             } else if(hotspot_type_json.access_method === "free") {
//                 calculated_sack_amount = 0;
//             } else {
//                 console.log(`ERROR: Unknown access type: ${hotspot_type_json.access_method}`);
//                 return;
//             }
//
//             console.log(`DEB2@calculated_sack_amount: ${calculated_sack_amount}`);
//
//             let calculated_pafren_amount;
//
//             if(hotspot_type_json.access_method === "pft") {
//                 calculated_pafren_amount = deserealized_ssid.cost * deserealized_ssid.pafren * 0.01 * 60;
//             } else if(hotspot_type_json.access_method === "pfd") {
//                 calculated_pafren_amount = deserealized_ssid.cost * deserealized_ssid.pafren * 0.01 * 64;
//             } else if(hotspot_type_json.access_method === "restricted") {
//                 calculated_pafren_amount = 0;
//             } else if(hotspot_type_json.access_method === "free") {
//                 calculated_pafren_amount = 0;
//             } else {
//                 console.log(`ERROR: Unknown access type: ${hotspot_type_json.access_method}`);
//                 return;
//             }
//
//             console.log(`hotspot_type_json.access_method: ${hotspot_type_json.access_method}`);
//
//             let calculated_number_of_sacks;
//
//             // if(hotspot_type_json.access_method === "pft" || hotspot_type_json.access_method === "pfd") {
//             //     calculated_number_of_sacks = calculated_pafren_amount / calculated_sack_amount;
//             // } else {
//             //     calculated_number_of_sacks = 0;
//             // }
//
//             if(hotspot_type_json.access_method === "pft") {
//                 calculated_number_of_sacks = calculated_pafren_amount / (calculated_sack_amount * 60);
//             } else if(hotspot_type_json.access_method === "pfd") {
//                 calculated_number_of_sacks = calculated_pafren_amount / (calculated_sack_amount * 64);
//             } else if(hotspot_type_json.access_method === "restricted") {
//                 calculated_number_of_sacks = 0;
//             } else if(hotspot_type_json.access_method === "free") {
//                 calculated_number_of_sacks = 0;
//             } else {
//                 console.log(`ERROR: Unknown access type: ${hotspot_type_json.access_method}`);
//                 return;
//             }
//
//             let pafren_length;
//
//             if(hotspot_type_json.access_method === "pft") {
//                 pafren_length = calculated_number_of_sacks * 60;
//             } else if(hotspot_type_json.access_method === "pfd") {
//                 pafren_length = 3600 * 24; // User has 24 hours to spend 1 GB. TODO: Change in future protocols.
//             } else if(hotspot_type_json.access_method === "restricted") {
//                 pafren_length = 0;
//             } else if(hotspot_type_json.access_method === "free") {
//                 pafren_length = 0;
//             } else {
//                 console.log(`ERROR: Unknown access type: ${hotspot_type_json.access_method}`);
//                 return;
//             }
//
//             client_session.set_client_session(
//                 {
//                     status: session_status.status.HANDSHAKE,
//                     ssid: chosen_ssid,
//                     ip: deserealized_ssid.ip,
//                     port: deserealized_ssid.port,
//                     prefix: deserealized_ssid.prefix,
//                     pfd: hotspot_type_json.access_method === "pfd",
//                     pft: hotspot_type_json.access_method === "pft",
//                     free: hotspot_type_json.access_method === "free",
//                     restricted: hotspot_type_json.access_method === "restricted",
//                     sack_number: 0,
//                     expiration_timestamp: timestamp.get_current_timestamp() + config_json.handshake_time,
//                     cost: deserealized_ssid.cost,
//                     pafren_percentage: deserealized_ssid.pafren,
//                     sack_amount: calculated_sack_amount,
//                     pafren_amount: calculated_pafren_amount,
//                     number_of_sacks: calculated_number_of_sacks,
//                     initiated_sack_number: 0
//                 }
//             );
//
//             config_json = config.read_default_config();
//
//             console.log(`CLIENT SESSION: ${JSON.stringify(client_session.get_client_session())}`);
//             console.log(`Handshake stage initiated.`);
//
//
//             console.log(`Saying HELLO to provider...`);
//
//             call_hello.call_hello(
//                 deserealized_ssid.ip,
//                 deserealized_ssid.port,
//                 new Web3(),
//                 private_key,
//                 uuid.generate_unique_id(),
//                 (response) => {
//                     console.log(`PROVIDER'S RESPONSE: ${response}`);
//
//                     let response_json = {};
//
//                     try {
//                         response_json = JSON.parse(response);
//                     } catch (error) {
//                         console.log(`ERROR: Unable to parse JSON: ${error}`);
//                     }
//
//                     if(response_json.command.arguments.answer === "HELLO-OK") {
//
//
//                         let response_json = JSON.parse(response);
//                         //let current_amount = deserealized_ssid.pafren * 0.01 * deserealized_ssid.cost * Math.pow(10, 12);
//
//                         let current_amount = calculated_pafren_amount * Math.pow(10, 12);
//                         console.log(`CALCULATED current_amount: ${current_amount}`);
//
//                         let current_timestamp = timestamp.get_current_timestamp();
//
//                         console.log(`=DEB(`);
//                         console.log(`deserealized_ssid.ip: ${deserealized_ssid.ip}`);
//                         console.log(`deserealized_ssid.port: ${deserealized_ssid.port}`);
//                         console.log(`private_key: ${private_key}`);
//                         console.log(`response_json.command.session: ${response_json.command.session}`);
//                         console.log(`response_json.command.uuid: ${response_json.command.uuid}`);
//                         console.log(`current_amount: ${current_amount}`);
//                         console.log(`current_timestamp: ${current_timestamp}`);
//                         console.log(`config_json.account.address: ${config_json.account.address}`);
//                         console.log(`response_json.command.from: ${response_json.command.from}`);
//                         console.log(`private_key: ${private_key}`);
//                         console.log(`)DEB=`);
//
//                         call_pafren.call_pafren(
//                             deserealized_ssid.ip,
//                             deserealized_ssid.port,
//                             new Web3(),
//                             private_key,
//                             response_json.command.session,
//                             response_json.command.uuid,
//                             current_amount,
//                             current_timestamp + pafren_length,
//                             encode_pafren.encode_pafren(
//                                 config_json.account.address,
//                                 response_json.command.from,
//                                 current_amount,
//                                 current_timestamp + pafren_length,
//                                 private_key
//                             ),
//                             (response1) => {
//                                 console.log(`PAFREN sent. RESPONSE1: ${response1}`);
//                                 let response1_json = {};
//                                 try {
//                                     response1_json = JSON.parse(response1);
//                                 } catch (e) {
//                                     console.log(`Failure to parse JSON: ${e}`);
//                                 }
//
//                                 if(response1_json.command.arguments.answer === "PAFREN-OK") {
//                                     console.log("Initiating sack sequence");
//                                     let session = config_json.client_session;
//                                     session.initiated_sack_number = 1;
//                                     session.pafren_timestamp = current_timestamp + pafren_length;
//                                     session.provider_address = response1_json.command.from;
//                                     session.session_id = response1_json.command.session;
//                                     session.status = session_status.status.ACTIVE;
//                                     client_session.set_client_session(session);
//                                     console.log("Calling the first sack");
//
//                                     console.log(`config_json.client_session.sack_amount: ${config_json.client_session.sack_amount}`);
//                                     console.log(`config_json.client_session.sack_number: ${config_json.client_session.sack_number}`);
//
//                                     let current_sack_amount = config_json.client_session.sack_amount * (config_json.client_session.sack_number + 1) * Math.pow(10, 12);
//                                     console.log(`CALCULATED current_sack_amount: ${current_sack_amount}`);
//
//                                     if(hotspot_type_json.access_method === "pft") {
//
//                                         call_sack.call_sack(
//                                             deserealized_ssid.ip,
//                                             deserealized_ssid.port,
//                                             new Web3(),
//                                             private_key,
//                                             response1_json.command.session,
//                                             response1_json.command.uuid,
//                                             current_sack_amount,
//                                             current_timestamp,
//                                             encode_sack.encode_sack(
//                                                 config_json.account.address,
//                                                 response_json.command.from,
//                                                 current_sack_amount,
//                                                 current_timestamp,
//                                                 private_key
//                                             ),
//                                             (response2) => {
//                                                 console.log(`SACK SENT. RESPONSE2: ${response2}`);
//
//                                                 let response2_json = {};
//
//                                                 try {
//                                                     response2_json = JSON.parse(response2);
//
//                                                     if (response2_json.command.arguments.answer === "SACK-OK") {
//                                                         console.log("SACK is accepted by provider! Session is active.");
//                                                         let session = config_json.client_session;
//                                                         session.status = session_status.status.ACTIVE;
//                                                         session.expiration_timestamp = current_timestamp + pafren_length;
//                                                         session.sack_number = 1;
//                                                         client_session.set_client_session(session);
//                                                         sack_timestamp.set_last_sack_timestamp(response2_json.command.timestamp);
//                                                         sackok.set_sackok(response2_json);
//                                                     }
//                                                 } catch (e) {
//                                                     console.log(`ERROR[3971f3907d]: unable to parsej JSON: ${e}`);
//                                                 }
//
//                                             });
//
//                                     }
//                                 } else if(response1_json.command.arguments.answer === "PAFREN-UNLIMITED") {
//                                     console.log("UNLIMITED SESSION ACTIVATED BY THE PROVIDER.");
//                                     let session = config_json.client_session;
//                                     session.status = session_status.status.ACTIVE;
//                                     session.expiration_timestamp = current_timestamp + 3600 * 24 * 365;
//                                     session.sack_number = 1;
//                                     client_session.set_client_session(session);
//                                     sack_timestamp.set_last_sack_timestamp(current_timestamp + 3600 * 24 * 365);
//
//                                 } else {
//                                     console.log("ERROR: UNKNOWN RESPONSE TO PAFREN.");
//                                 }
//                             }
//                         );
//                     } else {
//                         console.log(`The provider is not ready to serve. Continue connecting.`);
//                     }
//                 }
//             );
//         } else {
//             console.log(`Unable to connect to ${deserealized_ssid.ssid}`);
//         }
//     });
// }

// function client_worker(config_json, user_password, private_key, callback) {
//     console.log(`@DEB5 config_json.client_session.initiated_sack_number: ${config_json.client_session.initiated_sack_number}`);
//     console.log(`@DEB5 config_json.client_session.sack_number: ${config_json.client_session.sack_number}`);
//
//     const connection = require("./connection");
//     const handover = require("./handover");
//     const next_sack = require("./next_sack");
//
//     ssid.ssid_scan(config_json.wlan_interface, (networks) => {
//         ssid.save_ssids(networks.ssids);
//         // console.log("connector ssids:", networks.ssids);
//         // console.log("connector rssis:", networks.rssis);
//
//         let results = ssid.filter_onefi_neworks(networks);
//
//         console.log("results ssids:", results.ssids);
//         console.log("results rssis:", results.rssis);
//
//         let ind = fhs.fast_hotspot_selection_ng2(results, config_json);
//         console.log(`FHS: ${results.ssids[ind]} (${results.rssis[ind]})`);
//
//         let deserealized_ssid = ssid.deserialize_ssid(results.ssids[ind]);
//         let chosen_ssid = results.ssids[ind];
//
//         console.log(`DESEREALIZED: ${JSON.stringify(deserealized_ssid)}`);
//
//         // if(config_json.client_session.status !== session_status.status.EXPIRED) {
//         //     if(timestamp.get_current_timestamp() > config_json.client_session.expiration_timestamp) {
//         //         let session = config_json.client_session;
//         //         session.status = session_status.status.EXPIRED;
//         //         client_session.set_client_session(session);
//         //         console.log("Session declared as expired");
//         //         return callback();
//         //     }
//         // } else {
//         //     let session = config_json.client_session;
//         //     session.status = session_status.status.CLOSED;
//         //     client_session.set_client_session(session);
//         //     console.log("Session declared closed");
//         // }
//
//         if(config_json.client_session.status === session_status.status.ACTIVE) {
//                 // if(deserealized_ssid.prefix === config_json.client_session.prefix) {
//                 //     initiate_handover(deserealized_ssid, chosen_ssid);
//                 // } else {
//
//             if(config_json.client_session.pft || config_json.client_session.pfd) {
//                 let best_candidate_ssid = results.ssids[fhs.fast_hotspot_selection_ng(results)];
//                 console.log(`BEST CANDIDATE SSID:             ${best_candidate_ssid}`);
//                 console.log(`config_json.client_session.ssid: ${config_json.client_session.ssid}`);
//
//                 if(handover_helper.handover_match(config_json.client_session.ssid, best_candidate_ssid)) {
//                     console.log(`Handover match.`);
//
//                     if(config_json.allow_handover) {
//                         handover.initiate_handover(deserealized_ssid, chosen_ssid, user_password, private_key, config_json);
//                     }
//
//                 }
//             }
//
//             if(config_json.client_session.pft) {
//
//                 if(timestamp.get_current_timestamp() >= config_json.client_session.last_sack_timestamp + 50) {
//                     console.log(`***** Time to send the next sack. Current sack: ${config_json.client_session.sack_number}, Next sack: ${config_json.client_session.sack_number + 1} *****`);
//                     if (config_json.client_session.sack_number === config_json.client_session.number_of_sacks) {
//                         console.log("*** The session is over ***");
//                     } else {
//                         let initiated_sack_number = sack_number.get_initiated_sack_number();
//                         let current_sack_number = sack_number.get_sack_number();
//
//                         if (config_json.client_session.initiated_sack_number === config_json.client_session.sack_number) {
//                             sack_number.set_initiated_sack_number(initiated_sack_number + 1);
//                             config_json = config.read_default_config();
//                             if (config_json.client_session.initiated_sack_number !== initiated_sack_number + 1) {
//                                 console.log(`@DEB5: catch ya`);
//                             }
//                             next_sack.send_next_sack(config_json, user_password, private_key);
//                         }
//                     }
//                 }
//
//             }
//
//             console.log(`Continuie session`);
//             //}
//         } else if(config_json.client_session.status === session_status.status.HANDSHAKE) {
//             if(timestamp.get_current_timestamp() > config_json.client_session.expiration_timestamp) {
//                 let session = config_json.client_session;
//                 session.status = session_status.status.EXPIRED;
//                 client_session.set_client_session(session);
//                 console.log("Session declared as expired");
//                 return callback();
//             } else {
//                 console.log(`Continue handshake`);
//             }
//         } else {
//             if(config_json.client_session.scan_counter === 0) {
//                 connection.initiate_connection(deserealized_ssid, chosen_ssid, user_password, private_key, config_json);
//             } else if(config_json.client_session.scan_counter >= 15) {
//                 console.log("Trying to scan again");
//                 scan_counter.set_scan_counter(0);
//             } else {
//                 console.log("Wait for previous scan to complete");
//                 scan_counter.set_scan_counter(config_json.client_session.scan_counter + 1);
//             }
//         }
//
//         return callback();
//     });
// }