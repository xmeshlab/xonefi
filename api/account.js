/*
SPDX-License-Identifier: GPL-3.0-or-later

Copyright (c) 2019-2022 XOneFi <https://onefi.io>

XOneFi is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

XOneFi Router is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with XOneFi Router.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * Generate new Ethereum account and encrypt it using AES256 with CTR mode.
 * @param {string} seed - random seed.
 * @param {string} password - encryption password.
 * @returns {Object} A JSON object that cointains address, unencrypted private key and encrypted private key.
 */
function generate_account(seed, password) {
    var Web3 = require("web3");
    var web3 = new Web3();
    const symcrypto = require("./symcrypto");
    const os = require("os");

    var res = {"address": "", "privateKey": "", "encryptedPrivateKey": "" };
    var timed_seed = `${Date.now()}${seed}-${os.uptime()}-${os.totalmem()}-${os.cpus()[0].times.user}-${os.freemem()}`;
    var account = web3.eth.accounts.create(timed_seed);
    res.address = account.address;
    res.privateKey = account.privateKey;
    res.encryptedPrivateKey = symcrypto.encrypt_aes256ctr_base64(account.privateKey, password);

    return res;
}

/**
 * Import an exsting account using its private key.
 * @param {string} prk - private key.
 * @param {string} password - encryption password.
 * @returns {Object} A JSON object that cointains address, unencrypted private key and encrypted private key.
 */
function import_account(prk, password) {
    var Web3 = require("web3");
    var web3 = new Web3();
    const symcrypto = require("./symcrypto");
    const os = require("os");
    var res = {"address": "", "privateKey": "", "encryptedPrivateKey": "" };
    var account = web3.eth.accounts.privateKeyToAccount(prk);
    res.address = account.address;
    res.privateKey = account.privateKey;
    res.encryptedPrivateKey = symcrypto.encrypt_aes256ctr_base64(account.privateKey, password);

    return res;
}

/**
 * Get decrypted private key of the current account.
 * @param {string} password - encryption/decryption password.
 * @returns {string} Private key of the current account in hexadecimal format.
 */
function get_prk(password) {
    const symcrypto = require("./symcrypto");
    const config = require("./config");

    let config_json = config.read_default_config();
    let prk = symcrypto.decrypt_aes256ctr(config_json.account.encrypted_prk, password);

    // Some of them have prefix '0x', others go without prefix.
    if(prk.length !== 64 && prk.length !== 66) {
        return "";
    }

    return prk;
}

/**
 * Verify that the private key has a proper format.
 * @param {string} prk - private key in hexadecimal format, with or without 0x prefix.
 * @returns {boolean} true - correct format, false - incorrect format.
 */
function test_prk_format(prk) {
    let valid = true;

    if(prk.length >= 2) {
        if(prk[0] === '0' && prk[1] === 'x') {
            prk = prk.substr(2);
        }
    }

    if(prk.length === 64) {
        for(let i = 0; i < prk.length; i++) {
            if("0123456789abcdefABCDEF".indexOf(`${prk.charAt(i)}`) === -1) {
              valid = false;
              break;
            }
        }
    } else {
      valid = false;
    }

    return valid;
}

/**
 * Verify if the given address corresponds to the given private key.
 * @param {string} address - Ethereum address in hexadecimal string format.
 * @param {string} prk - private key in hexadecimal string format.
 * @returns {boolean} true - match, false - mismatch.
 */
function test_prk(address, prk) {
    if(!test_prk_format(prk)) {
        return false;
    }

    var Web3 = require("web3");
    var web3 = new Web3();
    var account = web3.eth.accounts.privateKeyToAccount(prk);
    return address.toLowerCase() === account.address.toLowerCase();
}


/**
 * Delete current (active) Ethereum account.
 * @returns {boolean} true - success, false - failure.
 */
function delete_current_account() {
    const config = require("./config");
    var config_json = config.read_default_config();

    config_json.account.name = "";
    config_json.account.address = "";
    config_json.account.encrypted_prk = "";
    config_json.account_set = false;

    return config.write_default_config(config_json);
}

/**
 * Verify if the given Ethereum address has a proper Ethereum format.
 * @param {string} address - Ethereum address in hexadecimal string format.
 * @returns {boolean} true - proper format, false - not an Ethereum address.
 */
function test_address(address) {
    var Web3 = require("web3");
    var web3 = new Web3();
    return web3.utils.isAddress(address);
}


/**
 * Extract XOneFi raw prefix of the current account, which is the lowercase sequence of the leading
 * 10 hexadecimal digits of the corresponding account address.
 * @returns {string} Raw prefix in hexadecimal string format.
 */
function get_account_raw_prefix() {
    const config  = require("./config");
    let config_json = config.read_default_config();

    if(config_json.account.address.length !== 42) {
        return ""
    }

    return config_json.account.address.substr(2, 10).toLowerCase();
}


module.exports = {
    generate_account,
    import_account,
    test_prk,
    test_prk_format,
    test_address,
    delete_current_account,
    get_prk,
    get_account_raw_prefix
};