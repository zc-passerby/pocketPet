/**
 * Created by Passerby on 2018-02-22.
 * App 配置信息
 */

var app = {
    appPort: 3000,
    mysqlHost: '47.89.246.80',
    mysqlPort: 3306,
    mysqlUser: 'root',
    mysqlPswd: 'Passerby',
    mysqlDbName: 'pocketPet',
    logger_path: './bin/logs/error.log',
    logger_level: 'debug'
};

module.exports = app;