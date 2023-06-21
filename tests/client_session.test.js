const { TestScheduler } = require("jest");

const client_session = require("../api/client_session")
const config = require("../api/config")


test("test set_client_session() should set the client session", () => {
    var config_json = config.read_default_config();
    let session = "bd81cf9e-2d20-438a-bc1c-a25be2df55c9"
    client_session.set_client_session(session)
    expect(config_json.client_session).toBe(session)
}
);

test("test get_client_session() should return the client session", () => {
    let session = "bd81cf9e-2d20-438a-bc1c-a25be2df55c9"
    expect(client_session.get_client_session()).toBe(session)
}
);
