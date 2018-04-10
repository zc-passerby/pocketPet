var utility = require('../common/utility');

//从数据库获取地图定义
function getFieldMapDefineFromDb() {
    var FieldMapInfo = db.get('FieldMapInfo');
    var dFieldMapInfo = {};
    FieldMapInfo.selectAll(function (err, result) {
        if (err) { //查询数据库失败
            console.log('getUserPetDefine failed.....');
            console.log(err);
        } else { //查询成功了
            if (result && result.length > 0) { //结果大于0
                for (var i = 0; i < result.length; i++) {
                    var mapInfo = result[i];
                    var mapPetBase = {};
                    if (!dFieldMapInfo.hasOwnProperty(mapInfo['mapID'])) {
                        var mapInfoBase = {};
                        mapInfoBase['mapName'] = mapInfo['mapName'];
                        mapInfoBase['mapType'] = mapInfo['mapType'];
                        mapInfoBase['mapIcon'] = mapInfo['mapIcon'];
                        mapInfoBase['minGoldCoin'] = mapInfo['minGoldCoin'];
                        mapInfoBase['maxGoldCoin'] = mapInfo['maxGoldCoin'];
                        mapInfoBase['minGoldIngot'] = mapInfo['minGoldIngot'];
                        mapInfoBase['maxGoldIngot'] = mapInfo['maxGoldIngot'];
                        mapInfoBase['minCrystal'] = mapInfo['minCrystal'];
                        mapInfoBase['maxCrystal'] = mapInfo['maxCrystal'];
                        mapInfoBase['minDropNum'] = mapInfo['minDropNum'];
                        mapInfoBase['maxDropNum'] = mapInfo['maxDropNum'];
                        mapInfoBase['dropProperty'] = mapInfo['dropProperty'];
                        mapInfoBase['mapPetList'] = [];
                        mapInfoBase['mapPetsInfo'] = {};
                        dFieldMapInfo[mapInfo['mapID']] = mapInfoBase;
                    }
                    var targetMapInfo = dFieldMapInfo[mapInfo['mapID']];
                    mapPetBase['petId'] = mapInfo['petId'];
                    mapPetBase['petName'] = mapInfo['petName'];
                    mapPetBase['petCC'] = mapInfo['petCC'];
                    mapPetBase['petClass'] = mapInfo['petClass'];
                    mapPetBase['minLevel'] = mapInfo['minLevel'];
                    mapPetBase['maxLevel'] = mapInfo['maxLevel'];
                    mapPetBase['exp'] = mapInfo['exp'];
                    mapPetBase['maxDropNum'] = mapInfo['petMaxDropNum'];
                    mapPetBase['dropProperty'] = mapInfo['petDropProperty'];
                    mapPetBase['zoneIndex'] = mapInfo['zoneIndex'];
                    if (mapInfo['petName'] != null) {
                        targetMapInfo['mapPetList'].push(mapInfo['petName']);
                        targetMapInfo['mapPetsInfo'][mapInfo['petName']] = mapPetBase;
                    }
                    //dFieldMapInfo[mapInfo['mapID']] = targetMapInfo;
                }
                global.fieldMapDefine = dFieldMapInfo;
            }
        }
    });
}

//加载地图定义
function loadFieldMapDefine() {
    if (global.fieldMapDefine == null || utility.isEmptyObject(global.fieldMapDefine)) {
        getFieldMapDefineFromDb();
    }
}

function reloadFieldMapDefine() {
    global.fieldMapDefine = null;
    getFieldMapDefineFromDb();
}

exports.loadFieldMapDefine = loadFieldMapDefine;
exports.reloadFieldMapDefine = reloadFieldMapDefine;