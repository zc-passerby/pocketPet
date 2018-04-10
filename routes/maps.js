var express = require('express');
var router = express.Router();

router.get('/enterMap', function (req, res) {
    console.log('------------------------------------ada');
    var mapId = req.query.mapId;
    console.log(mapId);
    var mapInfo = global.fieldMapDefine[mapId];
    console.log(mapInfo);
    res.render('mapInfo', {mapInfo:mapInfo});
});

module.exports = router;