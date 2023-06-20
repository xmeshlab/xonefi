
const { TestScheduler } = require("jest");
const account = require("../api/account");
// const config = require("../api/config")

function saveAccount(address, privateKey, encryptedPrivateKey) {
    const config = require("../api/config")
    var config_json = config.read_default_config();
    config_json.account.address = address;
    config_json.account.encrypted_prk = encryptedPrivateKey;
    config_json.account_set = true;
    var response = config.write_default_config(config_json);
}

describe('test account functions', () => {
  test('should return true for a valid Ethereum address', () => {
    const address = '0x9e54a13e0c0f0e9a9b6a2c3b2e3e8b6a2c3b2e3e';

    expect(account.test_address(address)).toBe(true);
  });

  test('should return false for an invalid Ethereum address', () => {
    const address = 'invalidaddress';

    expect(account.test_address(address)).toBe(false);
  });

  test("test_prk_format() returns true for a valid private key", () => {
    let prk = "a1ad37e64bf715dd0768fa0b6ab2fc45c518996fb8745cbd472a9e42e222a73b";
    expect(account.test_prk_format(prk)).toBe(true);
  });

  test('should generate a valid account', () => {
    const seed = 'randomseed';
    const password = 'password';
    const acct = account.generate_account(seed, password);
    expect(acct).toHaveProperty('address');
    expect(acct).toHaveProperty('privateKey');
    expect(acct).toHaveProperty('encryptedPrivateKey');
    expect(account.test_address(acct.address)).toBe(true);
    expect(account.test_prk(acct.address, acct.privateKey)).toBe(true);
  });

  test('should import an existing account', () => {
    const privateKey = '0xa1ad37e64bf715dd0768fa0b6ab2fc45c518996fb8745cbd472a9e42e222a73b';
    const password = 'seitlab123!@';
    const acct = account.import_account(privateKey, password);
    saveAccount(acct.address, acct.privateKey, acct.encryptedPrivateKey);
    expect(acct).toHaveProperty('address');
    expect(acct).toHaveProperty('privateKey');
    expect(acct).toHaveProperty('encryptedPrivateKey');
    expect(account.test_address(acct.address)).toBe(true);
    expect(account.test_prk(acct.address, acct.privateKey)).toBe(true);
  });

  test('should return the decrypted private key', () => {
    const password = 'seitlab123!@';
    const privateKey = account.get_prk(password);
    expect(account.test_prk_format(privateKey)).toBe(true);
    expect(privateKey).toBe('0xa1ad37e64bf715dd0768fa0b6ab2fc45c518996fb8745cbd472a9e42e222a73b');
  });

  test('should return the raw prefix of the current account', () => {
  const rawPrefix = account.get_account_raw_prefix();
   expect(rawPrefix.length).toBe(10);
   expect(rawPrefix).toBe('e7aee30782')
 });

 test('should delete the current account', () => {
  expect(account.delete_current_account()).toBe(true);
});

});


