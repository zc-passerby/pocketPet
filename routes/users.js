var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var svgCaptcha = require('svg-captcha');
var cryptoData = require('../common/cryptoData');
var userDataHandler = require('../common/userDataHandler');

var petFun = require('../functions/pet');
var userFun = require('../functions/user');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

/* Login system */
router.post('/login', function (req, res) {
    var User = db.get('User');  //从数据库中获取userInfo表的句柄
    var userName = req.body.username; // 获取post中的username值
    var userPswd = cryptoData.md5PwdKeyEncrypt(req.body.password); // 获取post中的password值并加密
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
                    req.session.userId = userInfo.id;
                    req.session.user = userInfo;
                    userFun.setUserData(req, User, userInfo);
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
    var userName = req.body.username; // 获取post中的用户名值
    var nickName = req.body.nickname; // 获取post中的昵称值
    var captcha = req.body.captcha; //获取post中的验证码
    var sex = req.body.sex; //获取post中的性别值
    var head = req.body.head; //获取post中的头像值
    var userPswd = cryptoData.md5PwdKeyEncrypt(req.body.password); // 获取post中的密码值并加密
    var userId = uuid.v1();
    var params = {id:userId, username:userName, nickname:nickName, password:userPswd, registerTime:new Date()};
    var sql = 'select (select count(0) from ' + tableName + ' where username=?) as userNameCount, (select count(0) from ' + tableName + ' where nickname=?) as nickNameCount from ' + tableName;
    var sqlParams = [userName, nickName];
    var retData = {errorCode:0, errorMsg:'', userId:userId};
    //console.log(captcha);
    //console.log(req.session.captcha);
    if (captcha != req.session.captcha) {
        retData.errorCode = 1;
        retData.errorMsg = "验证码错误";
        res.send(retData);
        return;
    }
    User.executeSql(sql, sqlParams, function (err, result) { //查询用户名是否存在
        if (err) {  //查询数据库失败就返回给原post处（login.html) 状态码为500的错误
            retData.errorCode = 1;
            retData.errorMsg = '查询数据库失败';
            console.log(err);
        } else {
            var userNameCount = 0;
            var nickNameCount = 0;
            if (result && result.length > 0) {
                userNameCount = result[0].userNameCount;
                nickNameCount = result[0].nickNameCount;
            }
            if (userNameCount != 0) {
                //req.session.error = "用户名已存在";
                //res.send(500);
                retData.errorCode = 1;
                retData.errorMsg = "用户名已存在";
            } else if (nickNameCount != 0) {
                //req.session.error = "昵称已存在";
                //res.send(500);
                retData.errorCode = 1;
                retData.errorMsg = "昵称已存在";
            } else { //可以注册
                params.sex = sex;
                var headImg = 'images/head/35.gif';
                var smallHeadImg = 'images/head/25.gif';
                if (~~head >= 1 && ~~head <= 6) {
                    headImg = 'images/head/3' + ~~head + '.gif';
                    smallHeadImg = 'images/head/2' + ~~head + '.gif';
                }
                params.headImg = headImg;
                params.smallHeadImg = smallHeadImg;
                //params.playerInfo = JSON.stringify(userFun.getDefaultPlayerInfo());
                User.insert(params, function (err, result) {
                    if (err) {  //查询数据库失败就返回给原post处（login.html) 状态码为500的错误
                        //res.send(500);
                        retData.errorCode = 1;
                        retData.errorMsg = '查询数据库失败';
                        console.log(err);
                    } else {
                        //req.session.error = "用户名注册成功";
                        userFun.createUserData(userId);
                        //res.send(200);
                    }
                });
            }
        }
        res.send(retData);
    });
});

//获取验证码
router.get('/getCaptcha', function (req, res) {
    var width = req.query.width ? req.query.width : 120;
    var height = req.query.height ? req.query.height : 30;
    var noise = req.query.noise ? req.query.noise : 8;
    var color = req.query.isColor ? req.query.isColor : false;
    var background = req.query.background ? req.query.background : '';
    var size = req.query.size ? req.query.size : 4;
    var ignoreChars = req.query.ignoreChars ? req.query.ignoreChars : '0o1i';
    var fontSize = req.query.fontSize ? req.query.fontSize : 40;
    var codeConfig = {
        size: size, // 验证码长度
        ignoreChars: ignoreChars, // 验证码字符中排除 0o1i
        noise: noise, // 干扰线条的数量
        color: color, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        background: background, // 验证码图片背景颜色
        width: width, // width of captcha
        height: height, // height of captcha
        fontSize: fontSize // captcha text size
    };
    var captcha = svgCaptcha.createMathExpr(codeConfig);
    req.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
    //console.log(req.session.captcha);
    //console.log(captcha.text.toLowerCase());
    //console.log(captcha.data);
    //res.type('image/svg+xml');
    //res.setHeader('Content-Type', 'text');
    //res.write(String(captcha.data));
    //res.end();
    //res.type('svg');
    //res.send(captcha.data);
    var codeData = {
        img: captcha.data
    };
    res.send(codeData);
});

//设置初始宠物
router.get('/setFirstPet', function (req, res) {
    var petId = req.query.petId;
    var petInfo = petFun.setFirstPet(petId);
    userDataHandler.saveUserDataByKey(req.session.userId, petInfo, userDataHandler.userDataSettings.petInfo);
    res.send(200);
});

module.exports = router;








































