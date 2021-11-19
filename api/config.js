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

/**
 * Thread/concurrency-safe procedure for reading configuration JSON from the configuration file.
 * @param {string} config_file - Absolute or relative path to the configuration file.
 * @returns {Object} JSON object with configuration parameters.
 */
function read_config(config_file) {
    var fs = require('fs');
    const lockfile = require('proper-lockfile');

    var obj = {}
    try {
        lockfile.lockSync(config_file);
    } catch (e) {
        console.log(`ERROR @lockSync: ${e}`);
    }

    var data = fs.readFileSync(config_file, {encoding:'utf8', flag:'r'});
    try {
        obj = JSON.parse(data);
    } catch (err) {
        obj = {};
    }

    try {
        lockfile.unlockSync(config_file);
    } catch (e) {
        console.log(`ERROR @unlockSync: ${e}`);
    }

    return obj;
}

/**
 * Thread/concurrency-safe procedure for writing configuration JSON to the configuration file.
 * @param {string} config_file - Absolute or relative path to the configuration file.
 * @param {Object} config_json - JSON object to store in the file.
 * @returns {boolean} true: success; false: failure.
 */
function write_config(config_file, config_json) {
    var fs = require('fs');
    var lockfile = require("proper-lockfile");

    try {
        lockfile.lockSync(config_file);
    } catch (e) {
        console.log(`ERROR @lockSync: ${e}`);
    }

    let data = JSON.stringify(config_json);
    let n = fs.writeFileSync(config_file, data); // TODO: get rid of n. Use try-catch instead.

    try {
        lockfile.unlockSync(config_file);
    } catch (e) {
        console.log(`ERROR @unlockSync: ${e}`);
    }

    if(n <= 0) { // TODO: safely get rid of this code.
        return false;
    } else {
        return true;
    }
}

/**
 * Cross-platform procedure for returning an absolute config path of the configuration file.
 * @returns {string} Absolute path.
 */
 function get_config_path() {
    const homedir = require('os').homedir();
    const path = require('path');
    return path.join(homedir, ".onefi.json");
 }

 /**
  * Safe procedure for checking the existence of configuratin (state) file.
  * @returns {boolean} true: configuration (state file) exists; false: the file does not exist.
  */
 function config_exists() {
    const fs = require('fs');
     const lockfile = require("proper-lockfile");

    try {
        if (fs.existsSync(get_config_path())) {
            return true;
        }
    } catch(err) {
        return false;
    }

    return false;
 }

 /**
  * Thread/concurrency-safe procedure for initialization of a config with pre-defined values. The default values are
  * taken from onefi-sample-config.json
  * @returns {boolean} true: success; false: failure.
  */
function config_init() {
    const fs = require('fs');
    //const lockfile = require("proper-lockfile");

     try {
         const data = fs.readFileSync('../onefi-sample-config.json', 'utf8')

        try {
            fs.writeFileSync(get_config_path(), data, {flag:'w'});
          } catch(err) {
            console.error(err);
            return false;
        }

     } catch (err) {
        console.error(err)
    }

    return true;
}

/**
 * Thread/concurrency-safe procedure for initialization of a config with pre-defined values only in the case if
 * the configuration (system state) file (a.k.a. onefi.json) is absent. The default values are
 * taken from onefi-sample-config.json
 * @returns {boolean} true: success; false: failure.
 */
function config_init_if_absent() {
    if(!config_exists()) {
        config_init();
        return true;
    } else {
        return false;
    }
}


/**
 * Thread/concurrency-safe procedure for reading the current configuration (state) JSON from the configuration file.
 * @returns {Object} JSON object with configuration and current system state parameters.
 */
function read_default_config() {
    return read_config(get_config_path());
}

/**
 * Thread/concurrency-safe procedure for writing configuration JSON to the current configuration file.
 * @param {Object} config_json - JSON object to store in the current configuration (system state) file.
 * @returns {boolean} true: success; false: failure.
 */
function write_default_config(config_json) {
    return write_config(get_config_path(), config_json);
}

/**
 * Thread/concurrency-safe async procedure for reading the current configuration (state) JSON from the configuration file.
 * @param {function} callback - retunrs a JSON object with configuration and current system state parameters.
 */
function read_default_config_db(callback) {
    return callback(read_config(get_config_path()));
}

/**
 * Thread/concurrency-safe procedure for writing configuration JSON to the current configuration file.
 * @param {Object} config_json - JSON object to store in the current configuration (system state) file.
 * @param {function} callback: returns true on success or false on failure.
 */
function write_default_config_db(config_json, callback) {
    return callback(write_default_config(config_json));
}

module.exports = {
    read_config,
    write_config,
    read_default_config_db,
    write_default_config_db,
    get_config_path,
    config_exists,
    config_init_if_absent,
    read_default_config,
    write_default_config
};