let mongoose=require('../config/mongonse');
let Schema = require('mongoose').Schema;
let userSchema=new Schema({
  username:String,
  main:String
})
let db_chat=mongoose.model('chat',userSchema);  
module.exports=db_chat;