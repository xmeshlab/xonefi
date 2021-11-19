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
 * Generates the gamma value for fast hotspot selection. See documentation/paper for more information.
 * @param {Object} hotspot_info_json - AP information JSON object.
 * @returns {int} Gamma value.
 */
function create_gamma(hotspot_info_json) {
    // TODO: Fix this function.
    let gamma = 0;

    if(hotspot_info_json.restrictedAccessAllowed) {
        gamma = gamma | 0x4000000000000000;
    }

    if(hotspot_info_json.freeHotspot) {
        gamma = gamma | 0x1000000000000000;
    }

    if(hotspot_info_json.activePaidSession) {
        gamma = gamma | 0x400000000000000;
    }

    if(hotspot_info_json.paidUnlimitedData) {
        gamma = gamma | 0x200000000000000;
    }

    if(hotspot_info_json.paidPerData) {
        gamma = gamma | 0x100000000000000;
    }

    if(hotspot_info_json.freqMatchMobilitySettings) {
        gamma = gamma | 0x20000000000000;
    }

    let channelAvailability = hotspot_info_json.channelAvailability % 8;
    channelAvailability = 7 - channelAvailability;
    channelAvailability = channelAvailability << 50;

    gamma |= channelAvailability;

    if(hotspot_info_json.starredHotspot) {
        gamma |= 0x2000000000000;
    }

    let paidHotspotCost = hotspot_info_json.paidHotspotCost >> 16;
    paidHotspotCost = paidHotspotCost % 65536;
    paidHotspotCost = 65535 - paidHotspotCost;
    paidHotspotCost = paidHotspotCost << 32;
    gamma |= paidHotspotCost;

    let downlinkBandwidth = hotspot_info_json.downlinkBandwidth % 256;
    downlinkBandwidth = downlinkBandwidth << 24;
    gamma |= downlinkBandwidth;

    let uplinkBandwidth = hotspot_info_json.uplinkBandwidth % 256;
    uplinkBandwidth = uplinkBandwidth << 16;
    gamma |= uplinkBandwidth;

    let prePayment = hotspot_info_json.prePayment % 256;
    prePayment = 255 - prePayment;
    prePayment = prePayment << 8;
    gamma |= prePayment;

    let signalStrength = hotspot_info_json.signalStrength % 256;
    gamma |= signalStrength;

    return gamma;
}

/**
 * Perform fast hotspot selection.
 * @param {Object} results - JSON object that consists of the list of OneFi SSIDs and RSSIs.
 * @returns {int} Index of the best hostpot to connect to.
 */
function fast_hotspot_selection(results) {
    const config = require("../api/config");
    const hotspot_type = require("../api/hotspot-type");
    const ssid = require("../api/ssid");

    let config_json = config.read_default_config();

    let gamma = new Array(results.ssids.length).fill(0);

    for(let i = 0; i < gamma.length; i++) {

        let ssid_json = ssid.deserialize_ssid(results.ssids[i]);

        let hotspot_type_json = hotspot_type.decode_hotspot_type(ssid_json.hotspot_type);

        let hotspot_info_json = {
            restrictedAccessAllowed: hotspot_type_json.access_method === "restricted",
            freeHotspot: hotspot_type_json.access_method === "free",
            activePaidSession: false,
            paidUnlimitedData: hotspot_type_json.access_method === "pft",
            paidPerData: hotspot_type_json.access_method === "pfd",
            freqMatchMobilitySettings: true,
            channelAvailability: 0,
            starredHotspot: false,
            paidHotspotCost: ssid_json.cost,
            downlinkBandwidth: ssid_json.downlink,
            uplinkBandwidth: ssid_json.uplink,
            prePayment: ssid_json.pafren,
            signalStrength: results.rssis[i]
        };


        gamma[i] = 0;
        gamma[i] = create_gamma(hotspot_info_json);
    }

    let maxGamma = Number.MIN_VALUE;
    let maxGammaIndex = -1;
    for (let i = 0; i < gamma.length; i++) {
        if(gamma[i] >= maxGamma) {
            maxGamma = gamma[i];
            maxGammaIndex = i;
        }
    }

    return maxGammaIndex;
}

/**
 * Perform fast hotspot selection (version for private hotspots).
 * @param {Object} results - JSON object that consists of the list of OneFi SSIDs and RSSIs.
 * @returns {int} Index of the best hostpot to connect to.
 */
function fast_hotspot_selection_ng(results) {
    let max_rssi = Number.MIN_VALUE;
    let argmax_rssi = -1;

    for(let i = 0; i < results.ssids.length; i++) {
        if(results.rssis[i] > max_rssi) {
            max_rssi = results.rssis[i];
            argmax_rssi = i;
        }
    }

    return argmax_rssi;
}


/**
 * Perform fast hotspot selection (temporary non-gamma version).
 * @param {Object} results - JSON object that consists of the list of OneFi SSIDs and RSSIs.
 * @returns {int} Index of the best hotspot to connect to.
 */
function fast_hotspot_selection_ng2(results, config_json) {
// This FHS algorithm accounts for restricted hotspots as well.
// Assume all results are pre-filtered OneFi-compatible hotspots.
// TODO: Incorporate the gamma-based implementation as above in the paper. Use the Android implementation as a reference.
    // Import API modules
    console.log("[56135ed74a]: 1");
    const ssid = require("./ssid");
    console.log("[56135ed74a]: 2");
    const hotspot_type = require("./hotspot-type");
    console.log("[56135ed74a]: 3");
    const private_provider_prefixes = require("./private_provider_prefixes");
    console.log("[56135ed74a]: 4");

    // Convert the list of private hotspot identities, stored in the confing, to the list of corresponding prefixes.
    console.log("[56135ed74a]: 5");
    let private_prefixes = private_provider_prefixes.get_private_provider_prefixes(config_json);
    console.log(`[56135ed74a]: 6, private_prefixes: ${private_prefixes}`);
    let max_rssi = Number.MIN_VALUE; // For determining a maximum RSSI value.
    console.log(`[56135ed74a]: 7, max_rssi: ${max_rssi}`);
    let argmax_rssi = -1; // For determining the argmax of the hostpot with the strongest signal.
    console.log(`[56135ed74a]: 8, argmax_rssi: ${argmax_rssi}`);
    // Look through all OneFi-cmpatible hotspots (APs). Each result has two arrays: ssids and rssis
    for(let i = 0; i < results.ssids.length; i++) {
        let dssid = ssid.deserialize_ssid(results.ssids[i]); // Turn Base64-encoded serialized SSID into human-readable JSON.
        let pref = dssid.prefix; // Read the prefix of the provider.
        let dhpt = hotspot_type.decode_hotspot_type(dssid.hotspot_type); // Turn number-encoded hotspot type into a human-undestandable JSON.
        // If "restricted" mode is used, only use the APs that client added as "trusted providers".
        if(dhpt.access_method === "restricted") {
            console.log(`@DEB7: pref: ${pref}`); // Just for debugging.
            if(!private_prefixes.includes(pref)) { // If the prefix does not match any of the trusted providers, ...
                continue; // skip this one.
            }
        }

        // Choose the hotspot with highest strength.
        // TODO: Implement the full algorithm.
        if(results.rssis[i] > max_rssi) {
            max_rssi = results.rssis[i];
            argmax_rssi = i;
        }
    }

    console.log(`[56135ed74a]: 9, argmax_rssi: ${argmax_rssi}`);

    return argmax_rssi;
}

module.exports = { fast_hotspot_selection, fast_hotspot_selection_ng, fast_hotspot_selection_ng2 };
