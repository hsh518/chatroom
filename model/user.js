let mongoose=require('../config/mongonse');
let Schema = require('mongoose').Schema;
let userSchema=new Schema({
  username:String,
  password:String
})
let db_user=mongoose.model('users',userSchema);  
module.exports=db_user;