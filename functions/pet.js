var utility = require('../common/utility');
// var petInfo_Demo = {
//     majorPet: 1,(1-3)
//     bagPet: [],
//     pasturePet: []
// };

var petAttrbuteBase = {
    HP: 450, //生命
    MP: 150, //魔法
    ATK: 250, //攻击
    DEF: 200, //防御
    ACC: 400, //命中
    EVA: 200, //闪避
    SPE: 500 //速度
};

//从数据库获取用户可获得宠物的定义
function getUserPetDefineFromDb() {
    var userPet = db.get('UserPet'); //从数据库中获取userPetDefine句柄
    var userPetMap = {};
    //console.log(db);
    //console.log(userPet);
    userPet.selectAll(function (err, result) {
        if (err) { //查询数据库失败
            console.log('getUserPetDefine failed.....');
            console.log(err);
        } else { //查询成功了
            if (result && result.length > 0) { //结果大于0
                for (var i = 0; i < result.length; i++) {
                    var petInfo = result[i];
                    petInfo = JSON.parse(JSON.stringify(petInfo));
                    //console.log(petInfo);
                    userPetMap[petInfo['petId'].toString()] = petInfo;
                }
            }
        }
        //console.log(userPetMap);
        global.userPetDefine = userPetMap;
    });
}

//加载用户可获得宠物的定义
function loadUserPetDefine() {
    if (global.userPetDefine == null || utility.isEmptyObject(global.userPetDefine)) {
        //global.userPetDefine = getUserPetDefineFromDb();
        getUserPetDefineFromDb();
    }
}

function reloadUserPetDefine() {
    global.userPetDefine = getUserPetDefineFromDb();
}

function setFirstPet(petId) {
    var petInfo = {
        majorPet: 0,
        bagPet: [],
        pasturePet: []
    };
    if (petId == null || petId == '') {
        petId = '1';
    }
    loadUserPetDefine();
    //console.log(global.userPetDefine);
    var targetPet = global.userPetDefine[petId];
    var singlePet = petAttrbuteBase;
    singlePet.petId = targetPet.petId;
    singlePet.petName = targetPet.petName;
    singlePet.petDept = targetPet.petDept;
    singlePet.petClass = targetPet.petClass;
    singlePet.petSkills = targetPet.petSkills;
    //singlePet.clone(targetPet);
    singlePet.CC = 2;
    petInfo.bagPet[0] = singlePet;
    //console.log(singlePet);
    //console.log(petInfo);
    return petInfo;
}

//exports.petAttrbuteBase = petAttrbuteBase;
exports.loadUserPetDefine = loadUserPetDefine;
exports.reloadUserPetDefine = reloadUserPetDefine;
exports.setFirstPet = setFirstPet;