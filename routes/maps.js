var express = require('express');
var router = express.Router();

var userDataHandler = require('../common/userDataHandler');

router.get('/enterMap', function (req, res) {
    var mapId = req.query.mapId;
    var mapInfo = global.fieldMapDefine[mapId];
    var petInfo = userDataHandler.loadUserDataByKey(req.session.userId, userDataHandler.userDataSettings.petInfo);
    console.log(petInfo['bagPet']);
    res.render('mapInfo', {mapInfo:mapInfo, bagPets:petInfo['bagPet']});
});

module.exports = router;