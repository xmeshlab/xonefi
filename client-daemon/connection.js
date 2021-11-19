/*
SPDX-License-Identifier: GPL-3.0-or-later

Copyright (c) 2020-2021 OneFi <https://onefi.io>

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

function initiate_connection(deserealized_ssid, chosen_ssid, user_password, private_key, config_json) {
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

    const Web3 = require('web3');

    console.log(`Initiating connection to: ${JSON.stringify(deserealized_ssid)}`);

    console.log(`chosen_ssid: ${chosen_ssid}`);

    wifi_connect.wifi_connect(chosen_ssid, (res) => {
        if(res === true) {
            console.log(`Successfully connected to ${chosen_ssid}`);

            console.log(`Initiating the handshake stage`);

            let hotspot_type_json = hotspot_type.decode_hotspot_type(deserealized_ssid.hotspot_type);

            let calculated_sack_amount;

            console.log(`DEB2@hotspot_type_json.access_method: ${hotspot_type_json.access_method}`);
            console.log(`DEB2@deserealized_ssid.cost: ${deserealized_ssid.cost}`);

            if(hotspot_type_json.access_method === "pft") {
                calculated_sack_amount = deserealized_ssid.cost / 60;
            } else if(hotspot_type_json.access_method === "pfd") {
                calculated_sack_amount = deserealized_ssid.cost / 64;
            } else if(hotspot_type_json.access_method === "restricted") {
                calculated_sack_amount = 0;
            } else if(hotspot_type_json.access_method === "free") {
                calculated_sack_amount = 0;
            } else {
                console.log(`ERROR: Unknown access type: ${hotspot_type_json.access_method}`);
                return;
            }

            console.log(`DEB2@calculated_sack_amount: ${calculated_sack_amount}`);

            let calculated_pafren_amount;

            if(hotspot_type_json.access_method === "pft") {
                calculated_pafren_amount = deserealized_ssid.cost * deserealized_ssid.pafren * 0.01 * 60;
            } else if(hotspot_type_json.access_method === "pfd") {
                calculated_pafren_amount = deserealized_ssid.cost * deserealized_ssid.pafren * 0.01 * 64;
            } else if(hotspot_type_json.access_method === "restricted") {
                calculated_pafren_amount = 0;
            } else if(hotspot_type_json.access_method === "free") {
                calculated_pafren_amount = 0;
            } else {
                console.log(`ERROR: Unknown access type: ${hotspot_type_json.access_method}`);
                return;
            }

            console.log(`hotspot_type_json.access_method: ${hotspot_type_json.access_method}`);

            let calculated_number_of_sacks;

            // if(hotspot_type_json.access_method === "pft" || hotspot_type_json.access_method === "pfd") {
            //     calculated_number_of_sacks = calculated_pafren_amount / calculated_sack_amount;
            // } else {
            //     calculated_number_of_sacks = 0;
            // }

            if(hotspot_type_json.access_method === "pft") {
                calculated_number_of_sacks = calculated_pafren_amount / (calculated_sack_amount * 60);
            } else if(hotspot_type_json.access_method === "pfd") {
                calculated_number_of_sacks = calculated_pafren_amount / (calculated_sack_amount * 64);
            } else if(hotspot_type_json.access_method === "restricted") {
                calculated_number_of_sacks = 0;
            } else if(hotspot_type_json.access_method === "free") {
                calculated_number_of_sacks = 0;
            } else {
                console.log(`ERROR: Unknown access type: ${hotspot_type_json.access_method}`);
                return;
            }

            let pafren_length;

            if(hotspot_type_json.access_method === "pft") {
                pafren_length = calculated_number_of_sacks * 60;
            } else if(hotspot_type_json.access_method === "pfd") {
                pafren_length = 3600 * 24; // User has 24 hours to spend 1 GB. TODO: Change in future protocols.
            } else if(hotspot_type_json.access_method === "restricted") {
                pafren_length = 0;
            } else if(hotspot_type_json.access_method === "free") {
                pafren_length = 0;
            } else {
                console.log(`ERROR: Unknown access type: ${hotspot_type_json.access_method}`);
                return;
            }

            client_session.set_client_session(
                {
                    status: session_status.status.HANDSHAKE,
                    ssid: chosen_ssid,
                    ip: deserealized_ssid.ip,
                    port: deserealized_ssid.port,
                    prefix: deserealized_ssid.prefix,
                    pfd: hotspot_type_json.access_method === "pfd",
                    pft: hotspot_type_json.access_method === "pft",
                    free: hotspot_type_json.access_method === "free",
                    restricted: hotspot_type_json.access_method === "restricted",
                    sack_number: 0,
                    expiration_timestamp: timestamp.get_current_timestamp() + config_json.handshake_time,
                    cost: deserealized_ssid.cost,
                    pafren_percentage: deserealized_ssid.pafren,
                    sack_amount: calculated_sack_amount,
                    pafren_amount: calculated_pafren_amount,
                    number_of_sacks: calculated_number_of_sacks,
                    initiated_sack_number: 0,
                    sackok: {},
                    provider_address: "",
                    last_sack_timestamp: 0,
                    scan_counter: 0,
                    paften_timestamp: 0,
                    session_id: ""
                }
            );

            config_json = config.read_default_config();

            console.log(`CLIENT SESSION: ${JSON.stringify(client_session.get_client_session())}`);
            console.log(`Handshake stage initiated.`);


            console.log(`Saying HELLO to provider...`);


            console.log("Setting a timeout...");
            setTimeout(() => {
                console.log("Timeout is over.");
                call_hello.call_hello(
                    deserealized_ssid.ip,
                    deserealized_ssid.port,
                    new Web3(),
                    private_key,
                    uuid.generate_unique_id(),
                    (response) => {
                        console.log(`PROVIDER'S RESPONSE: ${response}`);

                        let response_json = {};

                        try {
                            response_json = JSON.parse(response);
                        } catch (error) {
                            console.log(`ERROR: Unable to parse JSON: ${error}`);
                        }

                        if(response_json.command.arguments.answer === "HELLO-OK") {


                            let response_json = JSON.parse(response);
                            //let current_amount = deserealized_ssid.pafren * 0.01 * deserealized_ssid.cost * Math.pow(10, 12);

                            let current_amount = calculated_pafren_amount * Math.pow(10, 12);
                            console.log(`CALCULATED current_amount: ${current_amount}`);

                            let current_timestamp = timestamp.get_current_timestamp();

                            console.log(`=DEB(`);
                            console.log(`deserealized_ssid.ip: ${deserealized_ssid.ip}`);
                            console.log(`deserealized_ssid.port: ${deserealized_ssid.port}`);
                            console.log(`private_key: ${private_key}`);
                            console.log(`response_json.command.session: ${response_json.command.session}`);
                            console.log(`response_json.command.uuid: ${response_json.command.uuid}`);
                            console.log(`current_amount: ${current_amount}`);
                            console.log(`current_timestamp: ${current_timestamp}`);
                            console.log(`config_json.account.address: ${config_json.account.address}`);
                            console.log(`response_json.command.from: ${response_json.command.from}`);
                            console.log(`private_key: ${private_key}`);
                            console.log(`)DEB=`);

                            call_pafren.call_pafren(
                                deserealized_ssid.ip,
                                deserealized_ssid.port,
                                new Web3(),
                                private_key,
                                response_json.command.session,
                                response_json.command.uuid,
                                current_amount,
                                current_timestamp + pafren_length,
                                encode_pafren.encode_pafren(
                                    config_json.account.address,
                                    response_json.command.from,
                                    current_amount,
                                    current_timestamp + pafren_length,
                                    private_key
                                ),
                                (response1) => {
                                    console.log(`PAFREN sent. RESPONSE1: ${response1}`);
                                    let response1_json = {};
                                    try {
                                        response1_json = JSON.parse(response1);
                                    } catch (e) {
                                        console.log(`Failure to parse JSON: ${e}`);
                                    }

                                    if(response1_json.command.arguments.answer === "PAFREN-OK") {
                                        console.log("Initiating sack sequence");
                                        let session = config_json.client_session;
                                        session.initiated_sack_number = 1;
                                        session.pafren_timestamp = current_timestamp + pafren_length;
                                        session.provider_address = response1_json.command.from;
                                        session.session_id = response1_json.command.session;
                                        session.status = session_status.status.ACTIVE;
                                        client_session.set_client_session(session);
                                        console.log("Calling the first sack");

                                        console.log(`config_json.client_session.sack_amount: ${config_json.client_session.sack_amount}`);
                                        console.log(`config_json.client_session.sack_number: ${config_json.client_session.sack_number}`);

                                        let current_sack_amount = config_json.client_session.sack_amount * (config_json.client_session.sack_number + 1) * Math.pow(10, 12);
                                        console.log(`CALCULATED current_sack_amount: ${current_sack_amount}`);

                                        if(hotspot_type_json.access_method === "pft") {

                                            call_sack.call_sack(
                                                deserealized_ssid.ip,
                                                deserealized_ssid.port,
                                                new Web3(),
                                                private_key,
                                                response1_json.command.session,
                                                response1_json.command.uuid,
                                                current_sack_amount,
                                                current_timestamp,
                                                encode_sack.encode_sack(
                                                    config_json.account.address,
                                                    response_json.command.from,
                                                    current_sack_amount,
                                                    current_timestamp,
                                                    private_key
                                                ),
                                                (response2) => {
                                                    console.log(`SACK SENT. RESPONSE2: ${response2}`);

                                                    let response2_json = {};

                                                    try {
                                                        response2_json = JSON.parse(response2);

                                                        if (response2_json.command.arguments.answer === "SACK-OK") {
                                                            console.log("SACK is accepted by provider! Session is active.");
                                                            let session = config_json.client_session;
                                                            session.status = session_status.status.ACTIVE;
                                                            session.expiration_timestamp = current_timestamp + pafren_length;
                                                            session.sack_number = 1;
                                                            client_session.set_client_session(session);
                                                            sack_timestamp.set_last_sack_timestamp(response2_json.command.timestamp);
                                                            sackok.set_sackok(response2_json);
                                                        }
                                                    } catch (e) {
                                                        console.log(`ERROR[3971f3907d]: unable to parsej JSON: ${e}`);
                                                    }

                                                });

                                        }
                                    } else if(response1_json.command.arguments.answer === "PAFREN-UNLIMITED") {
                                        console.log("UNLIMITED SESSION ACTIVATED BY THE PROVIDER.");
                                        let session = config_json.client_session;
                                        session.status = session_status.status.ACTIVE;
                                        session.expiration_timestamp = current_timestamp + 3600 * 24 * 365;
                                        session.sack_number = 1;
                                        client_session.set_client_session(session);
                                        sack_timestamp.set_last_sack_timestamp(current_timestamp + 3600 * 24 * 365);

                                    } else {
                                        console.log("ERROR: UNKNOWN RESPONSE TO PAFREN.");
                                    }
                                }
                            );
                        } else {
                            console.log(`The provider is not ready to serve. Continue connecting.`);
                        }
                    }
                );
            }, 5000);
        } else {
            console.log(`Unable to connect to ${deserealized_ssid.ssid}`);
        }
    });
}

module.exports = { initiate_connection };