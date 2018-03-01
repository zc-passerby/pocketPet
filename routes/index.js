var express = require('express');
var cryptoData = require('../common/cryptoData');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title : '口袋精灵2测试区'});   // 到达此路径则渲染index文件，并传出title值供 index.html使用
});

/* GET login page. */
router.get('/login', function (req, res) {      // 到达此路径则渲染login文件，并传出title值供 login.html使用
    res.render('login', {title : '登录系统'})
});

/* GET register page. */
router.get('/register', function (req, res) {         // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render('register1', {title : '注册帐号'})
});

/* GET petIndex page. */
router.get('/petIndex', function (req, res) {
    if (!req.session.user) {
        req.session.error = "请先登录！";
        res.redirect('/login');
    }
    res.render('petIndex', {title:"欢迎" + req.session.user.nickname + "进入口袋精灵世界", userInfo:req.session.user})
});

/* GET update page. */
//更新日志
router.get('/showUpdateLog', function (req, res) {
    if (!req.session.user) {
        req.session.error = "请先登录！";
        res.redirect('/login');
    }
    res.render('update');
});

/* GET field expedition page. */
//野外探险
router.get('/fieldExpedition', function (req, res) {
    if (!req.session.user) {
        req.session.error = "请先登录！";
        res.redirect('/login');
    }
});

/* GET central town page. */
//中心城镇
router.get('/centralTown', function (req, res) {
    if (!req.session.user) {
        req.session.error = "请先登录！";
        res.redirect('/login');
    }
});

/* GET pet information page. */
//宠物资料
router.get('/petInfo', function (req, res) {
    if (!req.session.user) {
        req.session.error = "请先登录！";
        res.redirect('/login');
    }
});

/* GET player information page. */
//个人信息
router.get('/playerInfo', function (req, res) {
    if (!req.session.user) {
        req.session.error = "请先登录！";
        res.redirect('/login');
    }
    // var User = db.get('User');
    // var userId = req.session.user.id;
    // User.select(userId, function (err, result) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         if (result) {
    //             //var userInfo = result;
    //             req.session.user = result;
    //             res.render('playerInfo');
    //         }
    //     }
    // });
    //var userId = req.session.userId;
    var playerInfo = req.session.playerInfo;
    res.render('playerInfo', {playerInfo:playerInfo});
});

module.exports = router;
