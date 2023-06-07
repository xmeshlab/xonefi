const { TestScheduler } = require("jest");
const ssid = require("../api/ssid");

test('is_onefi_ssid() correctly identifies OneFi SSIDs', () => {
    expect(ssid.is_onefi_ssid("OFAGcMCsCoAG8MRQAAHtwAZIchXEJL")).toBe(true);
    expect(ssid.is_onefi_ssid("OGAGcMCsCoAG8MRQAAHtwAZIchXEJL")).toBe(false);
    expect(ssid.is_onefi_ssid("OFAGcMCsCoAG8MRQAAHtwAZIchXEJ")).toBe(false);
    expect(ssid.is_onefi_ssid("OFAKALCcCoAQsMRwAAHt0AeIchXEJL")).toBe(true);
});

test('is_onefi_ssid() correctly identifies OneFi SSIDs', () => {
    let networks = {ssids: ["OFA4gMBUEDAgED6AAADawAeYchXEJL",
        "Xfinity",
        "OFAMgNAn8AAAETiAAADhAAlochXEJL",
        "OFAGcMCsCoAG8MRQAAHtwAZIchXEJ",
        "OFtest",
        "OFAKgRDMCoAAMUUAAADtgA+ochXEJL"
    ],rssis:[""]};
    expect(ssid.filter_onefi_neworks(networks).ssids[0]).toBe("OFA4gMBUEDAgED6AAADawAeYchXEJL");
    expect(ssid.filter_onefi_neworks(networks).ssids[1]).toBe("OFAMgNAn8AAAETiAAADhAAlochXEJL");
    expect(ssid.filter_onefi_neworks(networks).ssids[2]).toBe("OFAKgRDMCoAAMUUAAADtgA+ochXEJL");
});


