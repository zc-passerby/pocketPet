var express = require('express');
var router = express.Router();

var userFun = require('../functions/user');
var userDataHandler = require('../common/userDataHandler');

/* set MajorPet */
router.get('/setMajorPet', function (req, res) {
    var bagId = req.query.bagId;
    var petInfo = userDataHandler.loadUserDataByKey(req.session.userId, userDataHandler.userDataSettings.petInfo);
    petInfo.majorPet = bagId;
    req.session.petInfo = petInfo;
    res.send(petInfo);
});

module.exports = router;