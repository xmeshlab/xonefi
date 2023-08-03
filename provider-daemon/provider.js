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

const Web3 = require('web3');                 // Library to work with Etheretum smart contracts
const sleep = require('thread-sleep');        // Thread-safe sleep functionality. Don't use single-thread methods here.
const uuid = require('uuid');                 // For generating properly random uuid v.4
const cluster = require('cluster');           // For threads (master-worker)
const config = require("../api/config");
const symcrypto = require("../api/symcrypto");
const timestamp = require("../api/timestamp");
const process_mgmt = require("../api/process_mgmt");
const last_sacks = require("./last_sacks.js");
const sack_mgmt = require("./sack_mgmt");
const contract_config = require("./contract_config");
const firewall = require("./firewall");
const session_uuids = require("./session_uuids");
const gas = require("./gas.js");
const session_stat = require("../api/session-status");
const express = require('express');
const bodyParser = require('body-parser');
const fw_write_policy = require('../api/fw_write_policy');
const fw_update_counter = require('../api/fw_update_counter');
const firewall_rules = require('../api/firewall_rules');


config.config_init_if_absent();

let config_json_new = config.read_default_config();
let worker;                                 // worker=cluster.fork();
let active_sessions = 0;                    // Session tally.
let contract_config_json = contract_config.get_contract_config_json(config_json_new);
var web3 = new Web3("wss://" + config_json_new.network + ".infura.io/ws/v3/" + config_json_new.infura_api_key);
let session_status = session_stat.status;

var session_statuses = new Map();               // Hash map of sessions.
var session_ipids = new Map();                    // IP addresses of clients associated with sessions.
var session_sack_deadlines = new Map();         // SACK deadlines (UNIX timestamp, seconds) for each session.
var session_pafren_expirations = new Map();     // Expiration time (UNIX timestamp, seconds) for each session.
var session_handshake_deadlines = new Map();    // UNIX timestamps (in seconds) for each session, until which a handshake is possible.
var session_clients = new Map();                // Establishes links between sessions and clients.
var used_uuids = [];                            // The list of used UUIDs. Each UUID has to be new (unique).
var clients_sessions = new Map();               // Allows to search sessions using client as a key.
var session_last_sacks = new Map();             // Stores last sacks received from clients.
let user_password  = process.argv[2];
let decrypted_private_key = symcrypto.decrypt_aes256ctr(config_json_new.account.encrypted_prk, user_password);

let restricted_sessions = new Set();
let unrestricted_sessions = new Set();

let restored_sessions = [];

last_sacks.restoreLastSacks(session_last_sacks);

if(cluster.isMaster) {
    if(!process_mgmt.save_pid(process_mgmt.get_provider_pid_path())) {
        console.log(`ERROR: Unable to save PID of the current process.`);
        process.exit(1);
    }

    worker = cluster.fork();

    worker.on('message', function(msg) {
        config_json_new = config.read_default_config();
        if(!config_json_new.ap_on) {
            console.log("Cloud is off.");
            return;
        }

        let restricted_ipids = [];
        let accepted_ipids = [];
        active_sessions = 0;
        let update_restrictions_flag = false;

        for (const [key, value] of session_statuses.entries()) {
            console.log(`SESSION: UUID: ${key}, STATUS: ${session_statuses.get(key)}, IPID: ${session_ipids.get(key)}, SACK DUE: ${session_sack_deadlines.get(key)}, PAFREN DUE: ${session_pafren_expirations.get(key)}, HANDSHAKE DUE: ${session_handshake_deadlines.get(key)}, CLIENT: ${session_clients.get(key)}`);

            if(Math.floor(new Date() / 1000) > session_sack_deadlines.get(key)) {
                console.log(`INFO: Session key=${key} MISSED A SACK.`);
                session_statuses.set(key, session_status.SLEEP);

                if(!restricted_sessions.has(key)) {
                    console.log(`The restricted_sessions set does not have the key '${key}'`)
                    console.log(`update_restrictions_flag: ${update_restrictions_flag}`);
                    update_restrictions_flag = true;
                    console.log(`update_restrictions_flag: ${update_restrictions_flag}`);
                    console.log(`restricted_sessions: ${restricted_sessions}`);
                    restricted_sessions.add(key);
                    console.log(`restricted_sessions: ${restricted_sessions}`);
                }
            }

            if(Math.floor(new Date() / 1000) > session_pafren_expirations.get(key)) {
                console.log(`INFO: Session key=${key} is EXPIRED.`);
                session_statuses.set(key, session_status.EXPIRED);
            }

            if(Math.floor(new Date() / 1000) > session_handshake_deadlines.get(key)
                && session_statuses.get(key) === session_status.HANDSHAKE)
            {
                console.log("INFO: Session " + key + " missed a handshake.");
                session_statuses.set(key, session_status.EXPIRED);
                if(!restricted_sessions.has(key)) {
                    update_restrictions_flag = true;
                    restricted_sessions.add(key);
                }
            }

            if(session_statuses.get(key) === session_status.ACTIVE) {

                if(restored_sessions.length > 0) {
                    console.log(`Found restored sessions, key=${key}`);
                    for(let rs of restored_sessions) {
                        let cipid = session_ipids.get(key);
                        let sss = cipid.split(";");
                        
                        console.log(`RESTORED_SESSION_INFO: cipid=${cipid}, provider_prefix=${sss[0]}, router_no=${sss[1]}`);

                        
                        let pol = firewall_rules.generate_accept_rule(sss[2], "137.184.243.11");
                        
                        fw_write_policy.write_firewall_policy(sss[0], sss[1], pol);
                        
                        let ret_status = fw_update_counter.increment_update_counter(sss[0], sss[1]);
                        
                        console.log(`fw_update_counter.increment_update.counter ret_status=${ret_status}`);
                        
                        // delta01
                        // accepted_ipids.push(cipid);
                    }

                    restored_sessions = [];
                    restricted_sessions.clear();
                    restricted_ipids = [];
                    update_restrictions_flag = false;
                }

                active_sessions++;
            }

            if(value === session_status.UNDEFINED
                || value === session_status.EXPIRED
                || value === session_status.CLOSED) {
                console.log("INFO: Session " + key + " is deleted.");

                console.log(`Restricted IPIDS before filtering: ${restricted_ipids}`);
                restricted_ipids = restricted_ipids.filter(item => item !== session_ipids.get(key));
                console.log(`Restricted IPIDS after filtering: ${restricted_ipids}`);

                
                // delta01
                console.log(`Accepted IPIDS before filtering: ${accepted_ipids}`);
                accepted_ipids = accepted_ipids.filter(item => item !== session_ipids.get(key));
                console.log(`Accepted IPIDS after filtering: ${accepted_ipids}`);
                
                let cipid = session_ipids.get(key);
                let sss = cipid.split(";");

                console.log(`SESSION_INFO: cipid=${cipid}, provider_prefix=${sss[0]}, router_no=${sss[1]}`);


                // let pol = firewall_rules.generate_accept_rule(sss[2], "137.184.243.11");
                // fw_write_policy.write_firewall_policy(sss[0], sss[1], pol);

                fw_write_policy.write_firewall_policy(sss[0], sss[1], "\n\n");

                let res_status = fw_update_counter.increment_update_counter(sss[0], sss[1]);
                console.log(`increment_update_counter result: ${res_status}`);

                session_statuses.delete(key);
                session_ipids.delete(key);
                session_sack_deadlines.delete(key);
                session_pafren_expirations.delete(key);
                let addr = clients_sessions.get(key);
                clients_sessions.delete(addr);
                session_clients.delete(key);
            }
        }

        // for (const [key, value] of session_statuses.entries()) {
        //     if(value === session_status.SLEEP
        //         || value === session_status.EXPIRED
        //         || value === session_status.CLOSED) {
        //         console.log("ADDING A RESTRICTED IPID: " + session_ipids.get(key));
        //         firewall.update_internet_restrictions(restricted_ipids);
        //         restricted_ipids.push(session_ipids.get(key));
        //     }
        // }

        // if(update_restrictions_flag) {
        //     console.log("Executing update_internet_restrictions()");
        //     firewall.update_internet_restrictions(restricted_ipids);
        //     update_restrictions_flag = false;
        // }

        
        //delta01
        
        for (const [key, value] of session_statuses.entries()) {
            if(value === session_status.SLEEP
                || value === session_status.EXPIRED
                || value === session_status.CLOSED) {
                console.log("ADDING A RESTRICTED IPID: " + session_ipids.get(key));
                //accepted_ipids.delete(session_ipids.get(key));


                let cipid = session_ipids.get(key);
                let sss = cipid.split(";");

                accepted_ipids = accepted_ipids.filter(item => item !== session_ipids.get(key));

                if(update_restrictions_flag === true) {
                    if(accepted_ipids.length === 0) {
                        console.log(`[4] update restrictions flag: ${update_restrictions_flag}`);
                        fw_write_policy.write_firewall_policy(sss[0], sss[1], "\n\n");
                        let ret_status = fw_update_counter.increment_update_counter(sss[0], sss[1]);                
                        console.log(`[4] fw_update_counter.increment_update.counter ret_status=${ret_status}`);   
                    } else {
                        firewall.update_internet_unrestrictions(accepted_ipids);
                    }
                }

                restricted_ipids.push(session_ipids.get(key));
            }

            if(value === session_status.HANDSHAKE
                || value === session_status.ACTIVE) {
                console.log("ADDING AN ACTIVE IPID: " + session_ipids.get(key));
                firewall.update_internet_unrestrictions(accepted_ipids);
                accepted_ipids.push(session_ipids.get(key));
            }
        }

        if(update_restrictions_flag) {
            console.log("Executing update_internet_unrestrictions()");
            firewall.update_internet_unrestrictions(accepted_ipids);
            update_restrictions_flag = false;
        }
        
        
        last_sacks.saveLastSacks(session_last_sacks);

        for (const [key, sack_str] of session_last_sacks.entries()) {
            var sack = JSON.parse(sack_str);
            var client = sack.client;
            var session_uuid = clients_sessions.get(client);
            var pafren_stamp = session_pafren_expirations.get(session_uuid);

            if(Math.floor(new Date() / 1000) > pafren_stamp) {
                var account = web3.eth.accounts.privateKeyToAccount(decrypted_private_key);
                web3.eth.accounts.wallet.add(account);
                var myContract = new web3.eth.Contract(contract_config_json.contract_abi, contract_config_json.smart_contract);
                let gas_offer = gas.get_gas_offer(config_json_new);

                console.log("XLOG: Calling the claim() function of the smart contract.")
                console.log(`XLOG: sack.client: ${sack.client}`);
                console.log(`XLOG: sack.amount.toString(): ${sack.amount.toString()}`);
                console.log(`XLOG: sack.timestamp: ${sack.timestamp}`);
                console.log(`XLOG: sack.proof: ${sack.proof}`);

                const { Worker } = require('worker_threads');

                const runClaim = () => {

                    const worker1 = new Worker('./claim.js', {
                        workerData: {
                            gas_offer: gas_offer,
                            decrypted_private_key: decrypted_private_key,
                            config_json_new: config_json_new,
                            contract_config_json: contract_config_json,
                            sack: sack
                        },
                    });

                    worker1.on('exit', () => {
                        console.log('Worker finished.');
                    });

                    worker1.on('error', (err) => {
                        console.error('Worker error:', err);
                    });
                };

                runClaim();

                session_last_sacks.delete(key);
                break;
            }
        }

        console.log("ACTIVE SESSIONS: " + active_sessions);
    });

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json({ type: 'application/*+json' }));

    const CLOUD_HOST = '0.0.0.0';
    const CLOUD_PORT = 3000;

    let jsonParser = bodyParser.json();

    app.post('/client', jsonParser, (req, res) => {
        if(!config_json_new.ap_on) {
            console.log("Hotspot is off.");
            return;
        }

        let response = {version: "0.3"};
        let json_object;
        let valid_json = true;

        console.log(`Request: ${JSON.stringify(req.body)}`);

        try {
            //json_object = JSON.parse(request.toString());
            json_object = req.body;
        } catch(e) {
            valid_json = false;
            console.log("ERROR[fe33e7d1ce80abe1]: Invalid JSON.");
            return;
        }

        if(valid_json) {
            if(!json_object.hasOwnProperty("command")) {
                valid_json = false;
                console.log("ERROR[cf4e4bad046f5a50]: Invalid JSON.");
            } else {
                if(!json_object.command.hasOwnProperty("op")) {
                    valid_json = false;
                    console.log("ERROR[99ae578cc1893059]: Invalid JSON.");
                }

                if(!json_object.command.hasOwnProperty("uuid")) {
                    valid_json = false;
                    console.log("ERROR[0fc3e1616aec441b]: Invalid JSON.");
                }

                if(!json_object.command.hasOwnProperty("timestamp")) {
                    valid_json = false;
                    console.log("ERROR[a514285c1b137ce3]: Invalid JSON.");
                }

                if(!json_object.command.hasOwnProperty("session")) {
                    valid_json = false;
                    console.log("ERROR[882eff2a807219a6]: Invalid JSON.");
                }

                if(!json_object.command.hasOwnProperty("re")) {
                    valid_json = false;
                    console.log("ERROR[a809d735a2893d7b]: Invalid JSON.");
                }

                if(!json_object.command.hasOwnProperty("client_ip")) {
                    valid_json = false;
                    console.log("ERROR[9c73979537d02bb8]: Invalid JSON.");
                }

                if(!json_object.command.hasOwnProperty("provider_prefix")) {
                    valid_json = false;
                    console.log("ERROR[533cbc22fae714af]: Invalid JSON.");
                }

                if(!json_object.command.hasOwnProperty("router_no")) {
                    valid_json = false;
                    console.log("ERROR[7aa8f34ef30c1e02]: Invalid JSON.")
                }

                if(!json_object.command.hasOwnProperty("arguments")) {
                    valid_json = false;
                    console.log("ERROR[556814bb82705883]: Invalid JSON.");
                }
            }

            if(!json_object.hasOwnProperty("signature")) {
                valid_json = false;
                console.log("ERROR[045d65679b60030f]: Invalid JSON.");
            }
        }

        if(valid_json) {
            // EIP-55-agnostic
            if(!web3.utils.isAddress(json_object.command.from)) {
                valid_json = false;
                console.log("ERROR[9a91fe16e91b3e8d]: Invalid JSON.");
            }

            if(!["HELLO", "PAFREN", "INFO", "STATUS", "SACK", "DONE", "HANDOVER"].includes(json_object.command.op)) {
                valid_json = false;
                console.log("ERROR[99e3fe8210e0b0ee]: Invalid JSON.");
            }

            // We stipulate the canonical 8-4-4-4-12 UUID format
            if(json_object.command.uuid.length === 36) {
                if(!session_uuids.hz_uuid_unique(json_object.command.uuid, used_uuids)) {
                    valid_json = false;
                    console.log("ERROR[bae4814c4beff111]: Invalid JSON.");
                }
            } else {
                valid_json = false;
                console.log("ERROR[e511db06333f62ce]: Invalid JSON.");
            }

            if(json_object.command.session.length === 36) {
                if(!session_uuids.hz_session_uuid_unique(json_object.command.session, used_uuids)) {
                    valid_json = false;
                    console.log("ERROR[028b7603cded3d0f]: Invalid JSON.");
                }
            } else {
                valid_json = false;
                console.log("ERROR[b8982ac6a1a346bc]: Invalid JSON.");
            }

            if(json_object.signature.length !== 132) {
                valid_json = false;
                console.log("ERROR[c4ba54a657b92bbb]: Invalid JSON.");
            }

            var recovered_address2 = web3.eth.accounts.recover(JSON.stringify(json_object.command), json_object.signature, false);

            console.log("Expected address: " + json_object.command.from);
            console.log("Recovered address: " + recovered_address2);

            if(recovered_address2.toLowerCase() !== json_object.command.from.toLowerCase()) {
                valid_json = false;
                console.log("ERROR[cfd7d5eb2b0fa526]: Invalid JSON.");
            } else {
                console.log("The message has been successfully verified!");
            }
        }

        response.command = {};
        response.command.op = json_object.command.op;
        response.command.from = config_json_new.account.address;
        response.command.uuid =  uuid.v4().toString();
        response.command.timestamp = Math.floor(new Date() / 1000);
        response.command.session = json_object.command.session;
        response.command.re = json_object.command.uuid;
        response.command.arguments = {};

        if(valid_json) {
            if(json_object.command.op === "HELLO") {
                if(clients_sessions.has(json_object.command.from)) {
                    if(clients_sessions[json_object.command.from] === json_object.command.session) {
                        response.command.arguments.answer = "HELLO-FAIL";

                        var signature_json = web3.eth.accounts.sign(
                            JSON.stringify(response.command),
                            decrypted_private_key
                        );

                        session_statuses[json_object.command.session] = session_status.CLOSED;
                        response.signature = signature_json.signature;

                        console.log(`XLOG: [1] sending response: ${JSON.stringify(response)}`);
                        res.send(JSON.stringify(response));
                        res.end();
                    } else {
                        response.command.arguments.answer = "HELLO-OK";
                        response.command.arguments.graceperiod = config_json_new.handshake_time;
                        response.command.arguments.sackperiod = config_json_new.sack_period;

                        var signature_json = web3.eth.accounts.sign(
                            JSON.stringify(response.command),
                            decrypted_private_key
                        );

                        response.signature = signature_json.signature;

                        if(clients_sessions.has(json_object.command.from)) {
                            session_statuses.set(clients_sessions.get(json_object.command.from), session_status.CLOSED);
                        }
                        session_statuses.set(json_object.command.session, session_status.HANDSHAKE);
                        session_handshake_deadlines.set(json_object.command.session, Math.floor(new Date() / 1000) + config_json_new.handshake_time);
                        //session_ipids.set(json_object.command.session, `${json_object.command.from};${json_object.command.provider_prefix}`);
                        session_ipids.set(json_object.command.session, `${json_object.command.provider_prefix};${json_object.command.router_no};${json_object.command.client_ip}`);
                        session_clients.set(json_object.command.session, json_object.command.from);
                        clients_sessions.set(json_object.command.from, json_object.command.session);

                        console.log(`XLOG: [2] sending response: ${JSON.stringify(response)}`);
                        res.send(JSON.stringify(response));
                        res.end();
                    }
                } else {
                    response.command.arguments.answer = "HELLO-OK";
                    response.command.arguments.graceperiod = config_json_new.handshake_time;
                    response.command.arguments.sackperiod = config_json_new.sack_period;
                    session_ipids[json_object.command.session] = `${json_object.command.from};${json_object.command.client_ip}`;

                    var signature_json = web3.eth.accounts.sign(
                        JSON.stringify(response.command),
                        decrypted_private_key
                    );

                    response.signature = signature_json.signature;

                    if(clients_sessions.has(json_object.command.from)) {
                        session_statuses.set(clients_sessions.get(json_object.command.from), session_status.CLOSED);
                    }
                    session_statuses.set(json_object.command.session, session_status.HANDSHAKE);
                    session_handshake_deadlines.set(json_object.command.session, Math.floor(new Date() / 1000) + config_json_new.handshake_time);
                    //session_ipids.set(json_object.command.session, `${json_object.command.from};${json_object.command.provider_prefix}`);
                    session_ipids.set(json_object.command.session, `${json_object.command.provider_prefix};${json_object.command.router_no};${json_object.command.client_ip}`);
                    session_clients.set(json_object.command.session, json_object.command.from);
                    clients_sessions.set(json_object.command.from, json_object.command.session);



                    let cipid = `${json_object.command.provider_prefix};${json_object.command.router_no};${json_object.command.client_ip}`;
                    let sss = cipid.split(";");

                    let pol = firewall_rules.generate_accept_rule(sss[2], "137.184.243.11");
                    fw_write_policy.write_firewall_policy(sss[0], sss[1], pol);
                    let ret_status = fw_update_counter.increment_update_counter(sss[0], sss[1]);
                    console.log(`[3] fw_update_counter.increment_update.counter ret_status=${ret_status}`);



                    console.log(`XLOG: [3] sending response: ${JSON.stringify(response)}`);
                    res.send(JSON.stringify(response));
                    res.end();
                }
            }

            if(json_object.command.op === "PAFREN") {
                if(session_statuses[json_object.command.session] === session_statuses.HANDSHAKE
                    || session_statuses[json_object.command.session] === session_statuses.ACTIVE) {

                    var hash = web3.utils.soliditySha3(
                        {t: 'bytes', v: '0x50'},
                        {t: 'address', v: json_object.command.arguments.pafren.client},
                        {t: 'address', v: config_json_new.account.address},
                        {t: 'uint256', v: json_object.command.arguments.pafren.amount.toString()},
                        {t: 'uint32', v: json_object.command.arguments.pafren.timestamp}
                    );

                    key2 = web3.eth.accounts.recover(hash, json_object.command.arguments.pafren.proof, false).toLowerCase();
                    var greenlight = false;

                    if(json_object.command.arguments.pafren.client.toLowerCase() === key2.toLowerCase() && key2.toLowerCase() === json_object.command.from.toLowerCase()) {
                        let cost;

                        if(config_json_new.cft) {
                            cost = config_json_new.price_ofi_hr;
                        } else if(config_json_new.cfd) {
                            cost = config_json_new.price_ofi_mb;
                        } else {
                            cost = 0;
                        }

                        let expected_pafren_amount;

                        if(config_json_new.cft) {
                            expected_pafren_amount = cost * config_json_new.pafren_percentage * 0.01 * 1000000000000 * 60;
                        } else if(config_json_new.cfd) {
                            expected_pafren_amount = cost * config_json_new.pafren_percentage * 0.01 * 1000000000000 * 64;
                        } else {
                            expected_pafren_amount = 0;
                        }

                        let calculated_sack_amount;

                        if(config_json_new.cft) {
                            calculated_sack_amount = cost / 60;
                        } else if(config_json_new.cfd) {
                            calculated_sack_amount = cost / 64;
                        } else {
                            calculated_sack_amount = 0;
                        }

                        let calculated_number_of_sacks;

                        if(config_json_new.cft) {
                            calculated_number_of_sacks = expected_pafren_amount / (Math.pow(10, 12) * calculated_sack_amount * 60);
                        } else if(config_json_new.cfd) {
                            calculated_number_of_sacks = expected_pafren_amount / (Math.pow(10, 12) * calculated_sack_amount * 64);
                        } else {
                            calculated_number_of_sacks = 0;
                        }

                        let pafren_length;

                        if(config_json_new.cft) {
                            pafren_length = calculated_number_of_sacks * 60;
                        } else if(config_json_new.cfd) {
                            pafren_length = 3600 * 24; // User has 24 hours to spend 1 GB. TODO: Change in future protocols.
                        } else {
                            pafren_length = 0;
                        }

                        if(sack_mgmt.sacks_needed(config_json_new)) {
                            if (json_object.command.arguments.pafren.amount >= expected_pafren_amount) {
                                if (Math.abs(json_object.command.arguments.pafren.timestamp - (timestamp.get_current_timestamp() + pafren_length)) <= config_json_new.handshake_time) {
                                    greenlight = true;
                                } else {
                                    console.log("PAFREN: WRONG TIMESTAMP");
                                }
                            } else {
                                console.log("PAFREN: WRONG AMOUNT");
                            }
                        } else {
                            greenlight = true;
                        }
                    } else {
                        console.log("PAFREN: WRONG CLIENT");
                    }

                    if(greenlight) {
                        console.log("LEGITIMATE PAFREN!");
                        var account = web3.eth.accounts.privateKeyToAccount(decrypted_private_key);
                        web3.eth.accounts.wallet.add(account);
                        var myContract = new web3.eth.Contract(contract_config_json.contract_abi, contract_config_json.smart_contract);
                        let gas_offer = gas.get_gas_offer(config_json_new);
                        let gas_price = gas.get_gas_price(config_json_new);

                        if(sack_mgmt.sacks_needed(config_json_new)) {

                            const { Worker } = require('worker_threads');

                            const runFreeze = () => {

                                const worker = new Worker('./freeze.js', {
                                    workerData: {
                                        json_object: json_object,
                                        gas_offer: gas_offer,
                                        gas_price: gas_price,
                                        session_statuses: session_statuses,
                                        session_status: session_status,
                                        session_pafren_expirations: session_pafren_expirations,
                                        decrypted_private_key: decrypted_private_key,
                                        session_handshake_deadlines: session_handshake_deadlines,
                                        session_sack_deadlines: session_sack_deadlines,
                                        config_json_new: config_json_new,
                                        contract_config_json: contract_config_json,
                                        response: response
                                    },
                                });

                                worker.on('exit', () => {
                                    console.log('Worker finished.');
                                });

                                worker.on('error', (err) => {
                                    console.error('Worker error:', err);
                                });
                            };

                            runFreeze();

                            if (session_statuses.get(json_object.command.session) === session_status.HANDSHAKE) {
                                response.command.arguments.answer = "PAFREN-OK";
                                session_pafren_expirations.set(json_object.command.session, json_object.command.arguments.pafren.timestamp);
                                var signature_json = web3.eth.accounts.sign(
                                    JSON.stringify(response.command),
                                    decrypted_private_key
                                );

                                response.signature = signature_json.signature;
                                session_statuses.set(json_object.command.session, session_status.ACTIVE);
                                session_handshake_deadlines.set(json_object.command.session, 0);
                                session_pafren_expirations.set(json_object.command.session, json_object.command.arguments.pafren.timestamp);
                                session_sack_deadlines.set(json_object.command.session, timestamp.get_current_timestamp() + config_json_new.sack_period);

                                console.log("JSON.stringify(response): " + JSON.stringify(response));
                                console.log(`XLOG: [4] sending response: ${JSON.stringify(response)}`);
                                res.send(JSON.stringify(response));
                                res.end();
                            }

                            // myContract.methods.freeze(json_object.command.arguments.pafren.client,
                            //     json_object.command.arguments.pafren.amount.toString(),
                            //     json_object.command.arguments.pafren.timestamp,
                            //     //web3.utils.hexToBytes(json_object.command.arguments.pafren.proof))
                            //     json_object.command.arguments.pafren.proof)
                            //     .send({from: account.address, gas: gas_offer, gasPrice: gas_price})
                            //     .on('transactionHash', function (hash) {
                            //         console.log("TNX HASH IS READY: " + hash);
                            //
                            //         if (session_statuses.get(json_object.command.session) === session_status.HANDSHAKE) {
                            //             response.command.arguments.answer = "PAFREN-OK";
                            //             session_pafren_expirations.set(json_object.command.session, json_object.command.arguments.pafren.timestamp);
                            //             var signature_json = web3.eth.accounts.sign(
                            //                 JSON.stringify(response.command),
                            //                 decrypted_private_key
                            //             );
                            //
                            //             response.signature = signature_json.signature;
                            //             session_statuses.set(json_object.command.session, session_status.ACTIVE);
                            //             session_handshake_deadlines.set(json_object.command.session, 0);
                            //             session_pafren_expirations.set(json_object.command.session, json_object.command.arguments.pafren.timestamp);
                            //             session_sack_deadlines.set(json_object.command.session, timestamp.get_current_timestamp() + config_json_new.sack_period);
                            //
                            //             console.log("JSON.stringify(response): " + JSON.stringify(response));
                            //             console.log("Remote.port: " + remote.port);
                            //             console.log("Remote.address: " + remote.address);
                            //
                            //             onefi_server.send(new Buffer(JSON.stringify(response)), remote.port, remote.address, function (err, bytes) {
                            //                 if (err) throw err;
                            //                 console.log(`Answer has been sent to ${remote.address}:${remote.port}`);
                            //             });
                            //         }
                            //     }).on('confirmation', function (confirmationNumber, receipt) {
                            //         console.log("CONF. #: " + confirmationNumber);
                            //         if (confirmationNumber >= config_json_new.call_confirmation_threshold
                            //             && session_statuses.get(json_object.command.session) === session_status.HANDSHAKE) {
                            //             console.log("CONFIRMATION IS READY. CONFIRMATION NUMBER: " + confirmationNumber);
                            //             console.log("CONFIRMATION PRELIMINARY RECEIPT: " + JSON.stringify(receipt));
                            //
                            //
                            //         }
                            //     }).on('receipt', function (receipt) {
                            //         console.log("RECEIPT IS READY: " + JSON.stringify(receipt_json));
                            //         console.log("session_statuses.get(json_object.command.session): " + session_statuses.get(json_object.command.session));
                            //
                            //         if (receipt.status === true) {
                            //             response.command.arguments.answer = "PAFREN-OK";
                            //             //session_pafren_expirations.set(json_object.command.session, json_object.command.arguments.pafren.timestamp);
                            //
                            //             var signature_json = web3.eth.accounts.sign(
                            //                 JSON.stringify(response.command),
                            //                 decrypted_private_key
                            //             );
                            //
                            //             response.signature = signature_json.signature;
                            //             session_statuses.set(json_object.command.session, session_status.ACTIVE);
                            //             session_handshake_deadlines.set(json_object.command.session, 0);
                            //             session_pafren_expirations.set(json_object.command.session, json_object.command.arguments.pafren.timestamp);
                            //
                            //             console.log("JSON.stringify(response): " + JSON.stringify(response));
                            //             console.log("Remote.port: " + remote.port);
                            //             console.log("Remote.address: " + remote.address);
                            //
                            //             this.send(new Buffer(JSON.stringify(response)), remote.port, remote.address, function (err, bytes) {
                            //                 if (err) throw err;
                            //                 console.log(`Answer has been sent to ${remote.address}:${remote.port}`);
                            //             });
                            //         } else {
                            //             response.command.arguments.answer = "PAFREN-FAIL";
                            //             session_statuses.set(json_object.command.session, session_status.CLOSED);
                            //             session_handshake_deadlines.set(json_object.command.session, 0);
                            //             session_pafren_expirations.set(json_object.command.session, 0);
                            //
                            //             var signature_json = web3.eth.accounts.sign(
                            //                 JSON.stringify(response.command),
                            //                 decrypted_private_key
                            //             );
                            //
                            //             response.signature = signature_json.signature;
                            //
                            //             this.send(new Buffer(JSON.stringify(response)), remote.port, remote.address, function (err, bytes) {
                            //                 if (err) throw err;
                            //                 console.log(`Answer has been sent to ${remote.address}:${remote.port}`);
                            //             });
                            //         }
                            //     }).on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                            //     console.log(`NEW ERROR: ${error}`);
                            //     console.log(`NEW RECEIPT: ${receipt}`);
                            //});
                        } else {
                            let gl = false;
                            if(config_json_new.private_provider) {
                                if(config_json_new.private_clients.includes(json_object.command.from) || config_json_new.private_clients.includes(response.command.from.toLowerCase())) {
                                    gl = true;
                                } else {
                                    console.log(`Client is not on the private list.`);
                                }
                            } else {
                                gl = true;
                            }

                            if(gl) {
                                response.command.arguments.answer = "PAFREN-UNLIMITED";
                                session_pafren_expirations.set(json_object.command.session, json_object.command.arguments.pafren.timestamp + 3600 * 24 * 365);
                                let signature_json = web3.eth.accounts.sign(
                                    JSON.stringify(response.command),
                                    decrypted_private_key
                                );

                                response.signature = signature_json.signature;
                                session_statuses.set(json_object.command.session, session_status.ACTIVE);
                                session_handshake_deadlines.set(json_object.command.session, 0);
                                session_pafren_expirations.set(json_object.command.session, json_object.command.arguments.pafren.timestamp);
                                session_sack_deadlines.set(json_object.command.session, timestamp.get_current_timestamp() + 3600 * 24 * 365);

                                console.log("JSON.stringify(response): " + JSON.stringify(response));
                                console.log(`XLOG: [5] sending response: ${JSON.stringify(response)}`);
                                res.send(JSON.stringify(response));
                                res.end();
                            }
                        }
                    } else {
                        console.log("WRONG PAFREN");
                    }
                } else {
                    console.log("PAFREN can only be accepted during either the HANDSHAKE status or the ACTIVE status.");
                }
            }

            if(json_object.command.op === "SACK") {
                if(session_statuses.get(json_object.command.session) === session_status.ACTIVE
                    || session_statuses.get(json_object.command.session) === session_status.SLEEP) {
                    var hash = web3.utils.soliditySha3(
                        {t: 'bytes', v: '0x53'},
                        {t: 'address', v: json_object.command.arguments.sack.client},
                        {t: 'address', v: config_json_new.account.address},
                        {t: 'uint256', v: json_object.command.arguments.sack.amount.toString()},
                        {t: 'uint32', v: json_object.command.arguments.sack.timestamp}
                    );

                    key2 = web3.eth.accounts.recover(hash, json_object.command.arguments.sack.proof, false).toLowerCase();
                    var greenlight = false;

                    if(json_object.command.arguments.sack.client.toLowerCase() === key2.toLowerCase() && key2.toLowerCase() === json_object.command.from.toLowerCase()) {
                        let previous_sack_amount;

                        try {
                            if(!session_last_sacks.has(json_object.command.session)) {
                                previous_sack_amount = 0;
                            } else {
                                previous_sack_amount = Number(JSON.parse(
                                    session_last_sacks.get(json_object.command.session)
                                ).amount);
                            }
                        } catch(e) {
                            console.log(`ERROR [4069a1bec9]: Unable to parse JSON: ${e}`);
                        }

                        let cost;

                        if(config_json_new.cft) {
                            cost = config_json_new.price_ofi_hr;
                        } else if(config_json_new.cfd) {
                            cost = config_json_new.price_ofi_mb;
                        } else {
                            cost = 0;
                        }

                        let expected_sack_amount;

                        if(config_json_new.cft) {
                            console.log(`SERVICE COST: ${cost}, PREVIOUS SACK AMOUNT: ${previous_sack_amount}`);
                            expected_sack_amount = Math.floor(previous_sack_amount + ((cost / 60) * 1000000000000));
                        } else if(config_json_new.cfd) {
                            console.log(`SERVICE COST: ${cost}, PREVIOUS SACK AMOUNT: ${previous_sack_amount}`);
                            expected_sack_amount = Math.floor(previous_sack_amount + ((cost / 64) * 1000000000000));
                        } else {
                            expected_sack_amount = 0;
                        }

                        if(json_object.command.arguments.sack.amount >= expected_sack_amount) {
                            greenlight = true;
                        } else {
                            console.log(`SACK: WRONG AMOUNT. Actual: ${json_object.command.arguments.sack.amount} Expected: ${expected_sack_amount}`);
                        }
                    } else {
                        console.log(`SACK: WRONG CLIENT: Actual: ${json_object.command.arguments.sack.client.toLowerCase()} Expected: ${key2.toLowerCase()}`);
                    }

                    if(greenlight) {
                        console.log("LEGITIMATE SACK!");


                        if(session_statuses.get(json_object.command.session) === session_status.SLEEP) {
                            restored_sessions.push(json_object.command.session);
                        }

                        response.command.arguments.answer = "SACK-OK";
                        response.command.arguments.pafren_expiration = session_pafren_expirations.get(json_object.command.session);

                        session_sack_deadlines.set(json_object.command.session, Math.floor(new Date() / 1000) + config_json_new.sack_period);
                        session_last_sacks.set(json_object.command.session, JSON.stringify(json_object.command.arguments.sack));
                        session_statuses.set(json_object.command.session, session_status.ACTIVE);

                        var signature_json = web3.eth.accounts.sign(
                            JSON.stringify(response.command),
                            decrypted_private_key
                        );

                        response.signature = signature_json.signature;
                        console.log(`XLOG: [6] sending response: ${JSON.stringify(response)}`);
                        res.send(JSON.stringify(response));
                        res.end();
                    } else {
                        console.log("BOGUS SACK");
                    }
                } else {
                    console.log("SACK only can be accepted during the ACTIVE and SLEEP statuses.");
                }
            }

            if(json_object.command.op === "INFO") {
                response.command.arguments.answer = "INFO-OK";

                var signature_json = web3.eth.accounts.sign(
                    JSON.stringify(response.command),
                    decrypted_private_key
                );

                response.signature = signature_json.signature;

                console.log(`XLOG: [7] sending response: ${JSON.stringify(response)}`);
                res.send(JSON.stringify(response));
                res.end();
            }

            if(json_object.command.op === "STATUS") {
                response.command.arguments.answer = "STATUS-OK";

                var signature_json = web3.eth.accounts.sign(
                    JSON.stringify(response.command),
                    decrypted_private_key
                );

                response.signature = signature_json.signature;

                console.log(`XLOG: [8] sending response: ${JSON.stringify(response)}`);
                res.send(JSON.stringify(response));
                res.end();
            }

            if(json_object.command.op === "DONE") {
                response.command.arguments.answer = "DONE-OK";

                var signature_json = web3.eth.accounts.sign(
                    JSON.stringify(response.command),
                    decrypted_private_key
                );

                response.signature = signature_json.signature;
                console.log(`XLOG: [9 sending response: ${JSON.stringify(response)}`);
                res.send(JSON.stringify(response));
                res.end();
            }

            if(json_object.command.op === "HANDOVER") {
                if(json_object.command.arguments.command.arguments.answer === "SACK-OK") {

                    var recovered_address2 = web3.eth.accounts.recover(JSON.stringify(json_object.command.arguments.answer.command), json_object.command.arguments.answer.signature, false);

                    if(recovered_address2.toLowerCase() === config_json_new.account.address.toLowerCase()) {
                        session_statuses[json_object.command.session] = session_status.ACTIVE;
                        response.command.arguments.answer = "HANDOVER-OK";
                        session_statuses.set(json_object.command.session, session_status.ACTIVE);
                        session_handshake_deadlines.set(json_object.command.session, 0);
                        session_pafren_expirations.set(json_object.command.session, json_object.command.arguments.command.arguments.pafren_expiration);
                        session_sack_deadlines.set(json_object.command.session, Math.floor(new Date() / 1000) + config_json_new.sack_period);

                        let signature_json = web3.eth.accounts.sign(
                            JSON.stringify(response.command),
                            decrypted_private_key
                        );

                        response.signature = signature_json.signature;
                        console.log(`XLOG: [10] sending response: ${JSON.stringify(response)}`);
                        res.send(JSON.stringify(response));
                        res.end();
                    } else {
                        console.log(`ERROR: Wrong SACK-OK.`);
                    }
                }
            }
        } else {
            response.command.arguments = "ERROR";

            var signature_json = web3.eth.accounts.sign(
                JSON.stringify(response.command),
                decrypted_private_key
            );

            response.signature = signature_json.signature;

            console.log(`XLOG: [11] sending response: ${JSON.stringify(response)}`);
            res.send(JSON.stringify(response));
            res.end();
        }
    });

    app.listen(CLOUD_PORT, () => {
        console.log(`Server is running on port ${CLOUD_PORT}`);
    });
} else {
    while(true) {
        process.send({ chat: "Hey master, check the sacks (" + config_json_new.ip + ")" });
        sleep(10000);
    }
}

