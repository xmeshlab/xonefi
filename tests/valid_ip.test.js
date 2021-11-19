const { TestScheduler } = require("jest");
const ip = require("../api/ip");

test('IP validation function works correctly', () => {
    expect(ip.valid_ip("0.0.0.0")).toBe(true);
    expect(ip.valid_ip("0.0.0.0.0")).toBe(false);
    expect(ip.valid_ip("0.0")).toBe(false);
    expect(ip.valid_ip("75.1.2.3")).toBe(true);
    expect(ip.valid_ip("75.1.2.300")).toBe(false);
    expect(ip.valid_ip("255.255.255.255")).toBe(true);
    expect(ip.valid_ip("192.168.0.1")).toBe(true);
    expect(ip.valid_ip("75.1..300")).toBe(false);
    expect(ip.valid_ip("75.1.2.")).toBe(false);
});