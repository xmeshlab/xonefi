const { TestScheduler } = require("jest");


const bnetwork = require("../api/bnetwork")
const config = require("../api/config")


test("test set_bnetwork() should set the blockchain network", () => {
    bnetwork.set_bnetwork("sepolia")

    var config_json = config.read_default_config();

    expect(config_json.network).toBe("sepolia")

    bnetwork.set_bnetwork("goerli")

    var config_json = config.read_default_config();

    expect(config_json.network).toBe("goerli")

}
);

test("test get_bnetwork() should return the blockchain network", () => {
    bnetwork.set_bnetwork("sepolia")

    var config_json = config.read_default_config();

    expect(bnetwork.get_bnetwork()).toBe("sepolia")

    bnetwork.set_bnetwork("goerli")

    var config_json = config.read_default_config();

    expect(bnetwork.get_bnetwork()).toBe("goerli")
}
);

test("test set_bnetwork_db() should set the blockchain network", () => {
    bnetwork.set_bnetwork("sepolia")

    var config_json = config.read_default_config();
    
    bnetwork.set_bnetwork_db("sepolia", (status) => {
        expect(config_json.network).toBe("sepolia")
    })

    bnetwork.set_bnetwork("goerli")

    var config_json = config.read_default_config();

    bnetwork.set_bnetwork_db("goerli", (status) => {
        expect(config_json.network).toBe("goerli")
    })
}
);



describe("get_bnetwork_db()", () => {
  test("test get_bnetwork_db() should return the blockchain network", () => {
    const callback = jest.fn();
    bnetwork.get_bnetwork_db(callback);
    expect(callback).toHaveBeenCalledWith("goerli");
  });
});
