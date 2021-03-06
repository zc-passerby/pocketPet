var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var tableDefine = require('./common/tableDefine');

var petFun = require('./functions/pet');
var mapFun = require('./functions/map');

var index = require('./routes/index');
var users = require('./routes/users');
var tasks = require('./routes/tasks');
var pets = require('./routes/pets');
var maps = require('./routes/maps');

global.db = require('./common/dbutil').Instance();
global.pwdKey = 'justForPocketPet';
global.userPetDefine = null;
global.fieldMapDefine = null;

//定义数据表实体
db.define(tableDefine);

petFun.loadUserPetDefine();
mapFun.loadFieldMapDefine();
//Express配置
var app = express();
app.use(session({
    secret : 'secretKey',
    cookie : {
        maxAge : 1000 * 60 * 10
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('PageMain', path.join(__dirname, 'PageMain'));
// app.set('view engine', 'jade');
app.engine("html", require("ejs").__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = "";
    if (err) {
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
    }
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/tasks', tasks);
app.use('/pets', pets);
app.use('/maps', maps);
//app.use('/login', index);
//app.use('/register', index);
//app.use('/logout', index);
//app.use('/home', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message : err.message,
            error : err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message : err.message,
        error : {}
    });
});

module.exports = app;
