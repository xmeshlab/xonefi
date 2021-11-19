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

function initiate_handover(deserealized_ssid, chosen_ssid, user_password, private_key, config_json) {
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


    console.log(`Handing the session over to: ${JSON.stringify(deserealized_ssid)}`);
    console.log(`Handover chosen_ssid: ${chosen_ssid}`);

    wifi_connect.wifi_connect(chosen_ssid, (res) => {
        if(res) {
            console.log(`Successfully connected to ${deserealized_ssid.ssid}`);
            console.log(`Initiating the handover stage`);

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
                    initiated_sack_number: 0
                }
            );

            config_json = config.read_default_config();

            console.log(`CLIENT SESSION: ${JSON.stringify(client_session.get_client_session())}`);
            console.log(`Handover stage initiated.`);
            console.log(`Saying HANDOVER to provider...`);

            call_handover.call_handover(
                deserealized_ssid.ip,
                deserealized_ssid.port,
                new Web3(),
                private_key,
                config_json.client_session.session_id,
                config_json.client_session.sackok,
                (response) => {
                    console.log(`PROVIDER'S RESPONSE: ${response}`);

                    let response_json = {};

                    try {
                        response_json = JSON.parse(response);
                    } catch (error) {
                        console.log(`ERROR: Unable to parse JSON: ${error}`);
                    }

                    if(response_json.command.arguments.answer === "HANDOVER-OK") {
                        let response_json = JSON.parse(response);

                        let session = config_json.client_session;
                        session.ssids = deserealized_ssid.ssid;
                        session.provider_address = response_json.command.from;
                        session.ip = deserealized_ssid.ip;
                        session.port = deserealized_ssid.port;
                        client_session.set_client_session(session);
                    } else {
                        console.log(`The provider is not ready to serve. Continue connecting.`);
                    }
                }
            );
        } else {
            console.log(`Unable to connect to ${deserealized_ssid.ssid}`);
        }
    });
}

module.exports = { initiate_handover };