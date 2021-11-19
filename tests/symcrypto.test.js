const { TestScheduler } = require("jest");
const symcrypto = require("../api/symcrypto");

test('encrypt_aes256ctr encrypts what decrypt_aes256ctr correctly decrypts', () => {
    const original_message = "Mary had a little lamb. Its fleece was white as snow.";
    const cipher = symcrypto.encrypt_aes256ctr_base64(original_message, "kombucha");
    const decrypted = symcrypto.decrypt_aes256ctr(cipher, "kombucha");
    expect(original_message).toBe(decrypted);
});