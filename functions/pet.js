
// var petInfo_Demo = {
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

//获取用户可获得宠物的定义
function getUserPetDefine() {
    var userPet = db.get('UserPet'); //从数据库中获取userPetDefine句柄
    var userPetMap = {};
    userPet.selectAll(function (err, result) {
        if (err) { //查询数据库失败
            console.log('getUserPetDefine failed.....');
            console.log(err);
        } else { //查询成功了
            if (result && result.length > 0) { //结果大于0
                for (var i = 0; i < result.length; i++) {
                    var petInfo = result[i];
                    console.log(petInfo);
                    userPetMap[petInfo['petId'].toString()] = petInfo;
                }
            }
        }
        return userPetMap;
    });
}


exports.petAttrbuteBase = petAttrbuteBase;
exports.getUserPetDefine = getUserPetDefine;