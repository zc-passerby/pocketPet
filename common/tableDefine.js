module.exports = [
    {
        key: 'User',
        name: 'userInfo',
        fields: ['id', 'username', 'email', 'nickname', 'password', 'sex', 'headImg', 'smallHeadImg', 'playerInfo', 'lastLoginTime', 'registerTime', 'lastLoginIp', 'timestamp']
    },
    {
        key: 'UserPet',
        name: 'userPetDefine',
        fields: ['petId', 'petName', 'petDept', 'petClass', 'petSkills', 'timestamp']
    }
]