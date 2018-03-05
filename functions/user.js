var userDataHandler = require('../common/userDataHandler');

//获取用户IP
function getClientIp(req) {
    return req.connection.remoteAddress || req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || req.connection.socket.remoteAddress;
}

//用户注册成功后相关数据的创建
function createUserData(userId) {
    console.log('createUserData');
    var playerInfo = getDefaultPlayerInfo();
    userDataHandler.saveUserDataByKey(userId, playerInfo, userDataHandler.userDataSettings.userInfo);
}

//用户的初始数据
function getDefaultPlayerInfo() {
    var playerInfo = {
        goldCoin: 500000,       //金币
        crystal: 0,             //水晶
        goldIngot: 0,           //元宝
        autoAttack: 1000,       //自动攻击次数
        prestige: 0             //威望值
    };
    //return JSON.stringify(playerInfo);
    return playerInfo;
}

//登录成功后相关数据的获取与设置
function setUserData(req, User, userInfo) {
    //console.log('setUserData');
    var clientIp = getClientIp(req);
    //console.log(clientIp);
    var params = {id:userInfo.id, lastLoginTime:new Date(), lastLoginIp:clientIp};
    User.update(params); //更新登陆时间
}

//exports.getClientIp = getClientIp;
exports.createUserData = createUserData;
exports.getDefaultPlayerInfo = getDefaultPlayerInfo;
exports.setUserData = setUserData;
