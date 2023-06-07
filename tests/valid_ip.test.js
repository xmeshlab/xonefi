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

test("get_provider_ip() returns a valid IP address", () => {
    let ip_address = ip.get_provider_ip();
    expect(ip.valid_ip(ip_address)).toBe(true);
});

test("set_provider_ip() saves a valid IP address", () => {
    let ip_address = "192.168.0.1";
    expect(ip.set_provider_ip(ip_address)).toBe(true);
    expect(ip.get_provider_ip()).toBe(ip_address);
});

test("get_port() returns a valid port number", () => {
    let port = ip.get_port();
    expect(port).toBeGreaterThanOrEqual(0);
    expect(port).toBeLessThanOrEqual(65535);
}
);

test("set_port() saves a valid port number", () => {
    let port = 12345;
    expect(ip.set_port(port)).toBe(true);
    expect(ip.get_port()).toBe(port);
}
);

test("valid_port() returns true for valid port numbers", () => {
    expect(ip.valid_port(0)).toBe(true);
    expect(ip.valid_port(65535)).toBe(true);
    expect(ip.valid_port(12345)).toBe(true);
    expect(ip.valid_port(1)).toBe(true);
    expect(ip.valid_port(65534)).toBe(true);
}
);