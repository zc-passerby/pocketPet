var crypto = require('crypto');

var md5Encrypto = function (str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str.toUpperCase();
}

var md5PwdKeyEncrypto = function (str) {
    var strEn = md5Encrypto(str);
    var pwdStr = strEn + global.pwdKey;
    return md5Encrypto(pwdStr);
}

exports.md5Encrypto = md5Encrypto;
exports.md5PwdKeyEncrypto = md5PwdKeyEncrypto;