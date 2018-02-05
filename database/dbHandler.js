var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require("./models");

for(var m in models) {
    mongoose.model(m, Schema(models[m]));
};

module.exports = {
    getModel : function (type) {
        return __getModel(type);
    }
};

var __getModel = function (type) {
    return mongoose.model(type);
};