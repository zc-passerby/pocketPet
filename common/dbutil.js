/**
 *MySQL Model
 **/

var mysql = require('mysql');
var util = require('util');
var conf = require('../configure');
var uuid = require('node-uuid');
var pool = null;
var db = null;

function Table(tableName, util, fields) {
    this.tableName = tableName;
    this.pool = util.pool;
    this.fields = fields;
}

//检查表字段
Table.prototype.checkTable = function (values) {
    if (values && this.fields) {
        var flag = false;
        this.fields.forEach(function (r) {
            for (var prop in values) {
                if (r === prop || r.name === prop) {
                    flag = true;
                }
            }
            if (!flag) {
                return false;
            }
        });
    }
    return true;
};

//clear表字段
Table.prototype.clearTable = function (values) {
    if (values && this.fields) {
        for (var prop in values) {
            var flag = false;
            for (var i = 0; i < this.fields.length; i++) {
                var r = this.fields[i];
                if (r === prop || r.name === prop) {
                    flag = true;
                    break;
                }
            }
            if (!flag && prop != null) {
                console.error("-not match property-" + prop);
                delete values[prop];
            }
        }
    }
    return true;
};

//获取连接，并调用回调函数
Table.prototype.getConnection = function (callback) {
    if (!callback) {
        callback = function () {};
    }
    this.pool.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        callback(connection);
    });
};

//insert
Table.prototype.insert = function (values, callback) {
    if (!callback) {
        callback = function () {};
    }
    var me = this;
    if (this.clearTable(values)) {
        if (typeof values['id'] == 'undefined' || values['id'] == null || values['id'] === "") {
            values['id'] = uuid.v1();
        }
        this.getConnection(function (connection) {
            var query = connection.query('insert into ' + me.tableName + ' set ?', values, function (err, result) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, values['id']); //TODO 返回生成的ID
                }
                connection.release(); //release
            });
            console.log('insert query: ' + query.sql);
        });
    }
};

//select_返回空为错误 根据ID获取单条数据（ID唯一）
Table.prototype.select = function (ID, callback) {
    if (!callback) {
        callback = function () {};
    }
    var me = this;
    if (ID != null && ID != "") {
        this.getConnection(function (connection) {
            var query = connection.query('select * from ' + me.tableName + ' where id=?', ID, function (err, result) {
                if (err || result.length < 1) {
                    callback(err, result);
                } else {
                    callback(null, result[0]);
                }
                connection.release(); //release
            });
            console.log('select query: ' + query.sql)
        });
    }
};

//select all
Table.prototype.selectAll = function (callback) {
    if (!callback) {
        callback = function () {};
    }
    var me = this;
    this.getConnection(function (connection) {
        var query = connection.query('select * from ' + me.tableName, function (err, result) {
            if (err) {
                callback(err, result);
            } else {
                callback(null, result);
            }
            connection.release(); //release
        });
        console.log('selectAll query: ' + query.sql);
    });
};

//update
Table.prototype.update = function (values, callback) {
    if (!callback) {
        callback = function () {};
    }
    var me = this;
    if (this.clearTable(values)) {
        this.getConnection(function (connection) {
            var query = connection.query('update ' + me.tableName + ' set ? where id=' + connection.escape(values.id), values, function (err, result) {
                if (err) {
                    callback(err, result);
                } else {
                    callback(null, result);
                }
                connection.release(); //release
            });
            console.log('update query: ' + query.sql);
        });
    }
};

//delete
Table.prototype.delete = function (ID, callback) {
    if (!callback) {
        callback = function () {};
    }
    var me = this;
    if (ID != null && ID != "") {
        this.getConnection(function (connection) {
            var query = connection.query('delete from ' + me.tableName + ' where id=?', ID, function (err, result) {
                if (err) {
                    callback(err, result);
                } else {
                    callback(null, result);
                }
                connection.release(); //release
            });
            console.log('delete query: ' + query.sql);
        });
    }
};

//exists
Table.prototype.exists = function (tableName, callback) {
    if (!callback) {
        callback = function () {};
    }
    if (tableName) {
        this.getConnection(function (connection) {
           var sql = "select table_name from information_schema.tables where table_schema='" + conf.mysqlDbName + "' and table_name='" + tableName + "'";
           var query = connection.query(sql, function (err, result) {
               if (err) {
                   callback(err, result);
               } else {
                   callback(null, result);
               }
               connection.release(); //release
           });
           console.log('exists query: ' + query.sql);
        });
    }
};

//truncate
Table.prototype.truncate = function (tableName, callback) {
    if (!callback) {
        callback = function () {};
    }
    if (tableName) {
        this.getConnection(function (connection) {
            var query = connection.query('TRUNCATE TABLE ' + tableName, function (err, result) {
                if (err) {
                    callback(err, result);
                } else {
                    callback(null, result);
                }
                connection.release(); //release
            });
            console.log('truncate query: ' + query.sql);
        });
    }
};

//for count
Table.prototype.count = function(callback) {
    if(!callback){
        callback=function () {};
    }
    var me = this;
    this.getConnection(function (connection) {
        var query = connection.query("select count(0) as count from " + me.tableName, function (err, result) {
            if (err) {
                callback(err, result);
            }else{
                callback(null, result[0].count);
            }
            connection.release(); //release
        });
        console.log('count query: ' + query.sql);
    });
};

Table.prototype.countBySql = function (sql, p, callback) {
    var me = this;
    if ((typeof p == 'function') && p.constructor == Function) {
        callback = p;
    } else {
        if (p) {
            for (var i = 0; i < p.length; i++) {
                sql = sql.replace('?', me.pool.escape(p[i]));
            }
        }
    }
    if(!callback){
        callback = function () {};
    }
    this.getConnection(function (connection) {
        var query = connection.query('select count(0) as count from (' + sql + ') T', function (err, result) {
            if (err) {
                callback(err, result);
            } else {
                callback(null, result[0].count);
            }
            connection.release(); //release
        });
    });
};

//条件查询
Table.prototype.selectByCondition = function (params, callback) {
    if(!callback){
        callback=function () {};
    }
    var me = this;
    var sql = 'select * from ' + me.tableName + ' where 1=1';
    if (this.clearTable(params)) {
        for (var pro in params) {
            sql += ' and ' + pro + '=' + me.pool.escape(params[pro]);
        }
    }
    this.getConnection(function (connection) {
        var query = connection.query(sql, function (err, result) {
            if (err) {
                callback(err, result);
            } else {
                callback(null, result);
            }
            connection.release(); //release
        });
        console.log('selectByCondition query: ' + query.sql);
    });
};

//条件查询，按字段排序
Table.prototype.selectByOrderCondition = function (params, orders, callback) {
    if(!callback){
        callback=function () {};
    }
    var me = this;
    var sql = 'select * from ' + me.tableName + 'where 1=1';
    if (this.clearTable(params)) { //条件
        for (var pro in params) {
            sql += ' and ' + pro + '=' + me.pool.escape(params[pro]);
        }
    }
    if (orders) { //排序
        for (var pro in orders) {
            sql += " order by " + pro + " " + orders[pro];
        }
    }
    if ((typeof orders == 'function') && orders.constructor == Function) {
        callback = orders;
    }

    this.getConnection(function (connection) {
        var query = connection.query(sql, function (err, result) {
            if (err) {
                callback(err, result);
            } else {
                callback(null, result);
            }
            connection.release(); //release
        });
        console.log('selectByOrderCondition query: ' + query.sql);
    });
};

//executeSql
Table.prototype.executeSql = function (sql, params, callback) {
    if(!callback){
        callback=function () {};
    }
    if (params) {
        for (var i = 0; i < params.length; i++) {
            sql = sql.replace("?", this.pool.escape(params[i]));
        }
    }
    this.getConnection(function (connection) {
        var query = connection.query(sql, function(err, result) {
            if (err) {
                callback(err, result);
            }else{
                callback(null, result);
            }
            connection.release(); //release
        });
        console.log('executeSql query: ' + query.sql);
    });
};

var createPool = function () {
    if (pool == null) {
        pool = mysql.createPool({
            host: conf.mysqlHost,
            user: conf.mysqlUser,
            password: conf.mysqlPswd,
            database: conf.mysqlDbName,
            port: conf.mysqlPort
        });
    }
    return pool;
};

//查询工具类
function DBUtil() {
    this.pool = createPool();
    this.tables = [];
}

//定义数据表
DBUtil.prototype.define = function (table) {
    var me = this;
    if (util.isArray(table)) {
        table.forEach(function (value) {
            console.log("tableKey:" + value.key + ",tableName:" + value.name);
            me.tables.push([value.key, new Table(value.name, me, value.fields)]);
        });
    } else {
        me.tables.push([table.key, new Table(table.name, me, table.fields)]);
    }
};

//获取数据表
DBUtil.prototype.get = function (tableName) {
    var me = this;
    if (tableName) {
        var _len = this.tables.length;
        for (var i = 0; i < _len; i++) {
            if (me.tables[i][0] == tableName) {
                return this.tables[i][1];
            }
        }
    }
    return null;
};

exports.Instance = function () {
    if (db == null) {
        db = new DBUtil();
    }
    return db;
};

































































































