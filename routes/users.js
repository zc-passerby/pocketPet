var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var cryptoData = require('../common/cryptoData');

//获取用户IP
function getClienIp(req) {
    return req.connection.remoteAddress || req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || req.connection.socket.remoteAddress;
}

//用户注册成功后相关数据的创建
function createUserData(userId) {
    console.log('createUserData');
}

//登录成功后相关数据的获取与设置
function setUserData(req, User, userInfo) {
    console.log('setUserData');
    var clientIp = getClienIp(req);
    console.log(clientIp);
    var params = {id:userInfo.id, lastLoginTime:new Date(), lastLoginIp:clientIp};
    User.update(params); //更新登陆时间
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Login system */
router.post('/login', function (req, res) {
    var User = db.get('User');  //从数据库中获取userInfo表的句柄
    var userName = req.body.username; // 获取post中的username值
    var userPswd = cryptoData.md5PwdKeyEncrypto(req.body.password); // 获取post中的password值并加密
    var params = {username:userName}; //查询数据库的条件
    User.selectByCondition(params, function (err, result) {
        if (err) {  //查询数据库失败就返回给原post处（login.html) 状态码为500的错误
            res.send(500);
            console.log(err);
        } else { //查询成功了
            if (result && result.length > 0) { //用户名是存在的
                var userInfo = result[0];
                console.log(userInfo);
                if (userPswd != userInfo.password) { //查询到匹配用户名的信息，但相应的password属性不匹配
                    req.session.error = "密码错误！！！";
                    res.send(404);
                } else { //信息匹配成功，则将此对象（匹配到的user) 赋给session.user ,更新登陆时间并返回成功
                    playerInfomation = userInfo;
                    req.session.user = playerInfomation;
                    setUserData(req, User, userInfo);
                    res.send(200);
                }
            } else { //查询不到用户名匹配信息，则用户名不存在，状态码返回404
                req.session.error = "用户名不存在！！！";
                res.send(404);
            }
        }
    });
});

/* register */
router.post('/register', function (req, res) {
    var User = db.get('User');  //从数据库中获取userInfo表的句柄
    var tableName = User.tableName; //表名
    var userName = req.body.username; // 获取post中的username值
    var nickName = req.body.nickname; // 获取post中的nickname值
    var userPswd = cryptoData.md5PwdKeyEncrypto(req.body.password); // 获取post中的password值并加密
    var userId = uuid.v1();
    var params = {id:userId, username:userName, nickname:nickName, password:userPswd, registerTime:new Date()};
    var sql = 'select (select count(0) from ' + tableName + ' where username=?) as userNameCount, (select count(0) from ' + tableName + ' where nickname=?) as nickNameCount from ' + tableName;
    var sqlParams = [userName, nickName];
    User.executeSql(sql, sqlParams, function (err, result) { //查询用户名是否存在
        if (err) {  //查询数据库失败就返回给原post处（login.html) 状态码为500的错误
            res.send(500);
            console.log(err);
        } else {
            var userNameCount = 0;
            var nickNameCount = 0;
            if (result && result.length > 0) {
                userNameCount = result[0].userNameCount;
                nickNameCount = result[0].nickNameCount;
            }
            if (userNameCount != 0) {
                req.session.error = "用户名已存在";
                res.send(500);
            } else if (nickNameCount != 0) {
                req.session.error = "昵称已存在";
                res.send(500);
            } else { //可以注册
                User.insert(params, function (err, result) {
                    if (err) {  //查询数据库失败就返回给原post处（login.html) 状态码为500的错误
                        res.send(500);
                        console.log(err);
                    } else {
                        req.session.error = "用户名注册成功";
                        createUserData(userId);
                        res.send(200);
                    }
                });
            }
        }
    });
});

module.exports = router;








































