var crypto = require('crypto');

var md5Encrypt = function (str) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str.toUpperCase();
};

var md5PwdKeyEncrypt = function (str) {
    const strEn = md5Encrypt(str);
    var pwdStr = strEn + global.pwdKey;
    return md5Encrypt(pwdStr);
};

var aes192Encrypt = function (str, key) {
    const cipher = crypto.createCipher('aes192', key);
    var retStr = cipher.update(str, 'utf8', 'hex');
    retStr += cipher.final('hex');
    return retStr;
};

var aes192Decrypt = function (str, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var retStr = decipher.update(str, 'hex', 'utf8');
    retStr += decipher.update('utf8');
    return retStr;
};

exports.md5Encrypt = md5Encrypt;
exports.md5PwdKeyEncrypt = md5PwdKeyEncrypt;
exports.aes192Encrypt = aes192Encrypt;
exports.aes192Decrypt = aes192Decrypt;