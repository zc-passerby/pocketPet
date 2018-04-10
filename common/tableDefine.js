module.exports = [
    {
        key: 'User',
        name: 'userInfo',
        fields: ['id', 'username', 'email', 'nickname', 'password', 'sex', 'headImg', 'smallHeadImg', 'playerInfo', 'lastLoginTime', 'registerTime', 'lastLoginIp', 'timestamp']
    },
    {
        key: 'UserPet',
        name: 'userPetDefine',
        fields: ['petId', 'petName', 'petImg', 'petDept', 'petClass', 'petSkills', 'timestamp']
    },
    {
        key: 'FieldMap',
        name: 'fieldMapDefine',
        fields: ['mapID', 'mapName', 'mapType', 'mapIcon', 'minGoldCoin', 'maxGoldCoin', 'minGoldIngot', 'maxGoldIngot', 'minCrystal', 'maxCrystal', 'minDropNum', 'maxDropNum', 'dropProperty']
    },
    {
        key: 'FieldPets',
        name: 'fieldMapPets',
        fields: ['petName', 'petId', 'mapID', 'dropProperty', 'petCC', 'petClass', 'minLevel', 'maxLevel', 'exp', 'maxDropNum', 'zoneIndex']
    },
    {
        key: 'FieldMapInfo',
        name: 'v_fieldMapInfo',
        fields: ['mapID', 'mapName', 'mapType', 'mapIcon', 'minGoldCoin', 'maxGoldCoin', 'minGoldIngot', 'maxGoldIngot', 'minCrystal', 'maxCrystal', 'minDropNum', 'maxDropNum', 'dropProperty', 'petId', 'petName', 'petDropProperty', 'petCC', 'petClass', 'minLevel', 'maxLevel', 'exp', 'petMaxDropNum', 'zoneIndex']
    }
]