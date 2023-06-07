
const { TestScheduler } = require("jest");
const account = require("../api/account");

describe('test_address', () => {
  test('should return true for a valid Ethereum address', () => {
    const address = '0x9e54a13e0c0f0e9a9b6a2c3b2e3e8b6a2c3b2e3e';

    expect(account.test_address(address)).toBe(true);
  });

  test('should return false for an invalid Ethereum address', () => {
    const address = 'invalidaddress';

    expect(account.test_address(address)).toBe(false);
  });
});


test("test_prk_format() returns true for a valid private key", () => {
    let prk = "c6c6e65b7a45f281c2a93a9e1bf6d7e705e79dd5aa5df32b122e95fb4d122e28";
    expect(account.test_prk_format(prk)).toBe(true);
});


describe('generate_account', () => {
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
});

describe('import_account', () => {
  test('should import an existing account', () => {
    const privateKey = '0x91fd81e7d3ed26c72ad904b89744f685f3dbbf358ff0ebd8f26c9747a178fb60';
    const password = 'seitlab123!@';

    const acct = account.import_account(privateKey, password);
    expect(acct).toHaveProperty('address');
    expect(acct).toHaveProperty('privateKey');
    expect(acct).toHaveProperty('encryptedPrivateKey');
    expect(account.test_address(acct.address)).toBe(true);
    expect(account.test_prk(acct.address, acct.privateKey)).toBe(true);
  });
});

describe('get_prk', () => {
  test('should return the decrypted private key', () => {
    const password = 'seitlab123!@';

    const privateKey = account.get_prk(password);

    expect(account.test_prk_format(privateKey)).toBe(true);
    expect(privateKey).toBe('0x91fd81e7d3ed26c72ad904b89744f685f3dbbf358ff0ebd8f26c9747a178fb60');
  });
});


describe('get_account_raw_prefix', () => {
  test('should return the raw prefix of the current account', () => {
    const rawPrefix = account.get_account_raw_prefix();

    expect(rawPrefix.length).toBe(10);
    expect(rawPrefix).toBe('d1feb8d074')
  });
});

describe('delete_current_account', () => {
  test('should delete the current account', () => {
    expect(account.delete_current_account()).toBe(true);
  });
});

