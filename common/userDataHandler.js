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
    // fs.open(userDataPath, 'r', function (err, fd) {
    //     if (err) {
    //         console.log('openFile ' + userDataPath + ' failed....');
    //     } else {
    //         fs.readFile(fd, 'utf-8', function (err, data) {
    //             if (err) {
    //                 console.log('readFile ' + userDataPath + ' failed....');
    //             } else {
    //                 userDataArr = data.split(userDataSplitStr);
    //             }
    //         });
    //     }
    // });
    try {
        var userData = fs.readFileSync(userDataPath, 'utf-8');
        userDataArr = userData.split(userDataSplitStr);
    } catch (err) {
        console.log(err);
        console.log('readFile ' + userDataPath + ' failed....');
    }
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    console.log(userDataArr);
    return userDataArr;
};

var saveUserData = function (userId, userDataArr) {
    const userDataPath = path.join(userDataDir, userId + '.dat');
    var userDataStr = '';
    for (var i = 0; i < userDataArr.length; i++) {
        userDataStr += userDataArr[i];
        console.log('##################################');
        console.log(i);
        console.log(userDataArr[i]);
        console.log('##################################');
        if (i != (userDataArr.length - 1)) {
            userDataStr += userDataSplitStr;
        }
    }

    // fs.open(userDataPath, 'w', function (err, fd) {
    //     if(err) {
    //         console.log('openFile ' + userDataPath + ' failed....');
    //     } else {
    //         fs.writeFile(fd, userDataStr, 'utf-8', function (err) {
    //             if (err) {
    //                 console.log('writeFile ' + userDataPath + ' failed....')
    //             }
    //         });
    //     }
    // });
    try {
        console.log(userDataStr);
        fs.writeFileSync(userDataPath, userDataStr, 'utf-8');
    } catch (err) {
        console.log(err);
        console.log('writeFile ' + userDataPath + ' failed....');
    }
};

// var loadUserInfoData = function (userId) {
//     var userDataArr = readUserData(userId);
//     if (userDataArr.length > 0) {
//         var userInfoData = cryptoData.aes192Decrypt(userDataArr[0].toLowerCase(), global.pwdKey);
//         return JSON.parse(userInfoData);
//     } else {
//         return "getNothing";
//     }
// };
//
// var saveUserInfoData = function (userId, userInfo) {
//     var userInfoData = JSON.stringify(userInfo);
//     userInfoData = cryptoData.aes192Encrypt(userInfoData, global.pwdKey);
//     var userDataArr = readUserData(userId);
//     if (userDataArr.length > 0) {
//         userDataArr[0] = userInfoData.toUpperCase();
//     } else {
//         userDataArr = [userInfoData.toUpperCase()];
//     }
//     saveUserData(userId, userDataArr);
// };

var loadUserDataByKey = function (userId, key) {
    if (typeof key == 'number' && key >= 1) {
        var userDataArr = readUserData(userId);
        key -= 1;
        if (userDataArr.length > key) {
            console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
            console.log(userDataArr[key].toLowerCase());
            var userInfoData = cryptoData.aes192Decrypt(userDataArr[key].toLowerCase(), global.pwdKey);
            console.log(userInfoData);
            return 0;//JSON.parse(userInfoData);
        } else {
            return -1;
        }
    } else {
        return -2;
    }
};

var saveUserDataByKey = function (userId, userDataSrc, key) {
    var userData = JSON.stringify(userDataSrc);
    console.log('******************************************************');
    console.log(userData);
    userData = cryptoData.aes192Encrypt(userData, global.pwdKey);
    console.log(userData);
    console.log(userData.toUpperCase());
    console.log('******************************************************');
    if (typeof key == 'number' && key >= 1) {
        key -= 1;
        var userDataArr = readUserData(userId);
        if (userDataArr.length > key) {
            userDataArr[key] = userData.toUpperCase();
            saveUserData(userId, userDataArr);
        } else {
            if (key == 0) {
                userDataArr = [userData.toUpperCase()];
                saveUserData(userId, userDataArr);
            } else {
                return -2;
            }
        }
        return 0;
    } else {
        return -2;
    }
};

exports.userDataSettings = userDataSettings;
exports.loadUserDataByKey = loadUserDataByKey;
exports.saveUserDataByKey = saveUserDataByKey;