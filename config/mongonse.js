let mongoose=require('mongoose');
let config=require('./config');
 console.log(config.mongodb);
mongoose.connect(config.mongodb);
let db=mongoose.connection;
db.on('error',(error)=>{
    console.log('数据库错误: '+error);
})
db.once('open',()=>{
    console.log('成功连接mongonDB');    
})
module.exports=db;   