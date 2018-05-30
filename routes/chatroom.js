let express=require('express');
let router=express.Router();
let db_user=require('../model/user')
router.get('/index',(req,res,next)=>{
  res.render('chatroom/index',{base_uel:global.base_url});
})
router.post('/index',(req,res,next)=>{
  let errdata=null;
  db_user.findOne({username:req.body.username,password:req.body.password},(err,result)=>{
    if(err){
      errdata='查询数据库出错';
      console.log('查询错误: '+err);
      res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
      res.end(errdata);
    }else{
      console.log(result)
      if(result===null){
        errdata='用户名或密码错误'
         res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.end(errdata);
        return
      }
       res.render('chatroom/index',{base_url:global.base_url,username:req.body.username});
    }
  })
 
})
module.exports=router;
