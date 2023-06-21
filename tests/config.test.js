const { TestScheduler } = require("jest");

const config = require("../api/config")

test("test config file exists", () => {
    expect(config.config_exists()).toBe(true)
}
);