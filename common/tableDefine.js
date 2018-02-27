module.exports = [
    {
        key: 'User',
        name: 'userInfo',
        fields: ['id', 'username', 'email', 'nickname', 'password', 'sex', 'headImg', 'playerInfo', 'lastLoginTime', 'registerTime', 'lastLoginIp', 'timestamp']
    },
    {
        key: 'UserPet',
        name: 'userPetInfo',
        fields: ['id', 'userId', 'petIndex', 'petExp', 'petCC', 'initialAttributes', 'equipments', 'equipPlus']
    }
]