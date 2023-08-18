/*
SPDX-License-Identifier: GPL-3.0-or-later

Copyright (c) 2019-2023 XOneFi

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
const sessions_db = require('../api/sessions_db');


config.config_init_if_absent();
let config_json_new = config.read_default_config();

sessions_db.insert_session_test(config_json_new);


