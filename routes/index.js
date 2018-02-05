var express = require('express');
var cryptoData = require('../common/cryptoData');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title : '口袋精灵2测试区'});   // 到达此路径则渲染index文件，并传出title值供 index.html使用
});

/* GET login page. */
router.route('/login').get(function (req, res) {      // 到达此路径则渲染login文件，并传出title值供 login.html使用
    res.render('login', {title : '登录系统'})
}).post(function (req, res) {                         // 从此路径检测到post方式则进行post数据的处理操作
    //get User info
    //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    var userInfo = global.dbHandler.getModel('userInfo');               // 获取数据库中userInfo表的句柄
    var userName = req.body.username;                                   // 获取post中的username值
    var userPswd = cryptoData.md5PwdKeyEncrypto(req.body.password);     // 获取post中的password值
    userInfo.findOne({UserName:userName}, function (err, doc) {
        if(err) {                                           // 错误就返回给原post处（login.html) 状态码为500的错误
            res.send(500);
            console.log(err);
        } else if(!doc) {                                   // 查询不到用户名匹配信息，则用户名不存在，状态码返回404
            req.session.error = "用户名不存在！！！";
            res.send(404);
            //res.redirect('/login');
        } else {
            if(userPswd != doc.Password) {                   // 查询到匹配用户名的信息，但相应的password属性不匹配
                req.session.error = "密码错误！！！";
                res.send(404);
            } else {                                        // 信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
                req.session.user = doc;
                res.send(200);
            }
        }
    });
});

/* GET register page. */
router.route('/register').get(function (req, res) {         // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render('register', {title : 'User Register'})
}).post(function (req, res) {
    //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    var userInfo = global.dbHandler.getModel('userInfo');
    var userName = req.body.username;
    var userPswd = cryptoData.md5PwdKeyEncrypto(req.body.password);
    userInfo.findOne({UserName:userName},function(err,doc){   // 同理 /login 路径的处理方式
        if(err){
            res.send(500);
            req.session.error =  '网络异常错误！';
            console.log(err);
        }else if(doc){
            req.session.error = '用户名已存在！';
            res.send(500);
        }else{
            userInfo.create({ 							// 创建一组user对象置入model
                UserName: userName,
                Password: userPswd
            },function(err, doc){
                if (err) {
                    res.send(500);
                    console.log(err);
                } else {
                    req.session.error = '用户名创建成功！';
                    res.send(200);
                }
            });
        }
    });
});

/* GET petIndex page. */
router.get('/petIndex', function (req, res) {
    if (!req.session.user) {
        req.session.error == "请先登录！";
        res.redirect('/login');
    }
    res.render('petIndex', {title : "欢迎" + req.session.user.UserName + "进入口袋精灵世界"})
});

module.exports = router;
