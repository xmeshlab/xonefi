const { TestScheduler } = require("jest");

test("requires server", () => {
    expect(1).toBe(1);
}
);

// const call_hello = require("../api/call_hello")
// const Web3 = require('web3');
// const config = require("../api/config")

// test("test call_hello() should return true", (done) => {
//     var web3 = new Web3();
//     let prk = "a1ad37e64bf715dd0768fa0b6ab2fc45c518996fb8745cbd472a9e42e222a73b";
//     let session = "bd81cf9e-2d20-438a-bc1c-a25be2df55c9"
//     call_hello.call_hello("127.0.0.1", "3141", web3, prk, session, (ret) => {
//         expect(ret).toBe(true);
//         done();
//     }
//     );
// });

