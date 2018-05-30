var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require("body-parser");
var IO = require('socket.io');  

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter=require('./routes/login');
var chatroomRouter=require('./routes/chatroom');
var fs=require('fs');

var app = express();


//设置全局变量
global.base_url='http://192.168.16.101:3000'
//Socket.IO
var server = require('http').createServer(app)
var socketIO = IO(server);
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false })); 

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login',loginRouter);
app.use('/chatroom',chatroomRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
//错误日志
var accessLogfile=fs.createWriteStream('./logs/access.log',{flags:'a'}); //访问日志
var errorLogfile=fs.createWriteStream('./logs/error.log',{flags:'a'}); //错误日志
if('production' == app.get('env')){
  app.use(express.logger({stream:accessLogfile}));
  app.use((err,req,res,next)=>{
    var now=new Date();
    var time=now.getFullYear()+'-'+now.getMonth()+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
    var meta='['+time+']'+req.method+' '+req.url+'\r\n';
    errorLogfile.write(meta.err.stack+'\r\n\r\n\r\n');
    next();
  })
} 

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//websocket
socketIO.on('connection', function (socket) {
  let db_chat=require('./model/chat');
  db_chat.find({},null,{sort:{_id:-1},limit:10}).exec((err,data)=>{
    if (err) {
      console.log('数据查询错误'+err)
     return false;
    }
    data=data.reverse();
     socketIO.emit('chat message',data);
  })
  socket.on('message',function(msg){
     db_chat.create({username:msg.username,main:msg.main},(err)=>{
       console.log(msg)
       if(err){
         console.log('数据存储错误: '+err);
       }else{
      socketIO.emit('new message',msg);
       }
     })
  })
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
})
server.listen(3001,()=>{
  console.log('soclet lister 3001');
})

module.exports = app;
