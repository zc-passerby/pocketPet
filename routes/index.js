var express = require('express');
var cryptoData = require('../common/cryptoData');
var router = express.Router();
var userDataHandler = require('../common/userDataHandler');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(global.fieldMapDefine);
    console.log(global.fieldMapDefine['1']['mapPetsInfo']['§神秘人§']);
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
    var target = req.query.target;
    if (target == 1) {
        res.render('battleMap');
    } else if (target == 2) {
        res.render('battleMap_1');
    }
});

/* GET central town page. */
//中心城镇
router.get('/centralTown', function (req, res) {
    if (!req.session.user) {
        req.session.error = "请先登录！";
        res.redirect('/login');
    }
    var target = req.query.target;
    if (target == 1) {
        res.render('map');
    } else if (target == 2) {
        res.render('map2');
    }
});

/* GET pet information page. */
//宠物资料
router.get('/petInfo', function (req, res) {
    if (!req.session.user) {
        req.session.error = "请先登录！";
        res.redirect('/login');
    }
    var petInfo = userDataHandler.loadUserDataByKey(req.session.userId, userDataHandler.userDataSettings.petInfo);
    var playerInfo = userDataHandler.loadUserDataByKey(req.session.userId, userDataHandler.userDataSettings.userInfo);
    res.render('petInfo', {petInfo:petInfo, playerInfo:playerInfo});
});

/* GET player information page. */
//个人信息
router.get('/playerInfo', function (req, res) {
    if (!req.session.user) {
        req.session.error = "请先登录！";
        res.redirect('/login');
    }
    var playerInfo = userDataHandler.loadUserDataByKey(req.session.userId, userDataHandler.userDataSettings.userInfo);
    res.render('playerInfo', {playerInfo:playerInfo});
});

module.exports = router;
