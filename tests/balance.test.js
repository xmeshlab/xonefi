//Test get_account_balance() function still needs work

// const { TestScheduler } = require("jest");

// const balances = require("../api/balances");
// const account = require("../api/account")
// const config = require("../api/config")
// const infura = require("../api/infura")

// function saveAccount() {
//     const privateKey = '0xa1ad37e64bf715dd0768fa0b6ab2fc45c518996fb8745cbd472a9e42e222a73b';
//     const password = 'seitlab123!@';
//     const acct = account.import_account(privateKey, password);

//     infura.save_infura_id = "ef1ce1202d8248a69d1eacd3a6237f28"

//     var config_json = config.read_default_config();
//     //config.read_default_config_db((config_json) => {
//     config_json.account.address = acct.address;
//     config_json.account.encrypted_prk = acct.encryptedPrivateKey;
//     config_json.account_set = true;
//     config_json.network = "goerli";

//     var response = config.write_default_config(config_json);
//     console.log("Test Config Saved:" + response)
// }



// describe("get_account_balance()", () => {
//     test("test get_account_balance() should return the balance of the current account", async () => {

//         saveAccount();
        
//         var config_json = config.read_default_config();

//         const getAccountBalanceAsync = () => {
//             return new Promise((resolve, reject) => {
//                 balances.get_account_balance((balance) => {
//                     resolve(balance);
//                 });
//             });
//         };

//         const accountBalance = await getAccountBalanceAsync();

//         console.log("Balance: " + accountBalance);
//     });
// });
