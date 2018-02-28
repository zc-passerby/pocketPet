/*
 * 用户数据操作（文件）
 */

var fs = require('fs');
var path = require('path');
var cryptoData = require('./cryptoData');
var conf = require('../configure');

var userDataDir = path.join(__dirname, conf.userData_path);

var readUserData = function (userId) {
    userDataPath = path.join(userDataDir, userId + '.dat');
    
};