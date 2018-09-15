const sha512 = require('crypto-js/sha512');
const Base64 = require('crypto-js/enc-base64');
const key = process.env.PASSWORD_CRYPTO_KEY;

module.exports = function (password) {
    return Base64.stringify(sha512(password, key))
};
