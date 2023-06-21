const {TestScheduler} = require("jest");

const client = require("../api/client")
const config = require("../api/config")

test("test set_client_status() should set the client status", () => {
    let enabled = true
    client.set_client_status(enabled)
    expect(client.get_client_status()).toBe(enabled)
}
);

test("test get_client_status() should return the client status", () => {
    let enabled = true
    client.set_client_status(enabled)
    expect(client.get_client_status()).toBe(enabled)
}
);

test("test set_pay_for_data() should set the client PFD parameter", () => {
    var config_json = config.read_default_config();
    let enabled = true
    client.set_pay_for_data(enabled)
    expect(config_json.pfd).toBe(enabled)
}
);

test("test get_pay_for_data() should return the client PFD parameter", () => {
    let enabled = true
    expect(client.get_pay_for_data()).toBe(enabled)
}
);

test("test set_pay_for_time() should set the client PFT parameter", () => {
    var config_json = config.read_default_config();
    let enabled = true
    client.set_pay_for_time(enabled)
    expect(config_json.pft).toBe(enabled)
}
);

test("test get_pay_for_time() should return the client PFT parameter", () => {
    let enabled = true
    expect(client.get_pay_for_time()).toBe(enabled)
}
);

test("test set_private_client() should set the private client value", () => {
    var config_json = config.read_default_config();
    let enabled = true
    client.set_private_client(enabled)
    expect(config_json.private_client).toBe(enabled)
}
);

test("test get_private_client() should return the private client value", () => {
    let enabled = true
    expect(client.get_private_client()).toBe(enabled)
}
);



test("test set_max_ofi_mb() should set the max ofi mb value", () => {
    var config_json = config.read_default_config();
    let price = 20 
    client.set_max_ofi_mb(price)
    expect(config_json.max_ofi_mb).toBe(price)
}
);

test("test get_max_ofi_mb() should return the max ofi mb value", () => {
    let price = 20
    client.set_max_ofi_mb(price)
    expect(client.get_max_ofi_mb()).toBe(price)
}
);