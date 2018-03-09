/*
 * 用户数据操作（文件）
 */

var fs = require('fs');
var path = require('path');
var cryptoData = require('./cryptoData');
var conf = require('../configure');

var userDataSplitStr = "POCKET0O1LPET";
var userDataDir = path.join(__dirname, '../' + conf.userData_dir);
const userDataSettings = {
    userInfo: 1,    //用户信息
    petInfo: 2      //宠物信息
};

var readUserData = function (userId) {
    const userDataPath = path.join(userDataDir, userId + '.dat');
    var userDataArr = [];
    try {
        var userData = fs.readFileSync(userDataPath, 'utf-8');
        userDataArr = userData.split(userDataSplitStr);
    } catch (err) {
        console.log(err);
        console.log('readFile ' + userDataPath + ' failed....');
    }

    return userDataArr;
};

var saveUserData = function (userId, userDataArr) {
    const userDataPath = path.join(userDataDir, userId + '.dat');
    var userDataStr = '';
    for (var i = 0; i < userDataArr.length; i++) {
        userDataStr += userDataArr[i];
        if (i != (userDataArr.length - 1)) {
            userDataStr += userDataSplitStr;
        }
    }
    try {
        console.log(userDataStr);
        fs.writeFileSync(userDataPath, userDataStr, 'utf-8');
    } catch (err) {
        console.log(err);
        console.log('writeFile ' + userDataPath + ' failed....');
    }
};

var loadUserDataByKey = function (userId, key) {
    if (typeof key == 'number' && key >= 1) {
        var userDataArr = readUserData(userId);
        key -= 1;
        if (userDataArr.length > key) {
            var retJson = {};
            var targetStr = userDataArr[key].toLowerCase();
            if (typeof targetStr == 'string' && targetStr != '') {
                var userInfoData = cryptoData.aes192Decrypt(targetStr, global.pwdKey);
                retJson = JSON.parse(userInfoData);
            }
            return retJson;
        } else {
            return -1;
        }
    } else {
        return -2;
    }
};

var saveUserDataByKey = function (userId, userDataSrc, key) {
    if (typeof key == 'number' && key >= 1) {
        key -= 1;
        var userDataArr = readUserData(userId);
        var userData = JSON.stringify(userDataSrc);
        userData = cryptoData.aes192Encrypt(userData, global.pwdKey);
        userData = userData.toUpperCase();
        // if (userDataArr.length > key) {
        //     userDataArr[key] = userData;
        //     saveUserData(userId, userDataArr);
        // } else {
        //     if (key == 0) {
        //         userDataArr = [userData];
        //         saveUserData(userId, userDataArr);
        //     } else {
        //         return -2;
        //     }
        // }
        if (userDataArr.length <= key) {
            for (var i = 0; i <= key; i++) {
                if (i >= userDataArr.length) {
                    userDataArr.push('');
                }
            }
        }
        userDataArr[key] = userData;
        saveUserData(userId, userDataArr);
        return 0;
    } else {
        return -2;
    }
};

exports.userDataSettings = userDataSettings;
exports.loadUserDataByKey = loadUserDataByKey;
exports.saveUserDataByKey = saveUserDataByKey;