let express=require('express');
let router=express.Router();
let db_user=require('../model/user')
router.get('/reg',(req,res,next)=>{
  
  res.render('user/reg',{base_uel:global.base_url});
})
router.get('/lg',(req,res,next)=>{
  res.render('user/lg',{base_url:global.base_url});
})
router.post('/lg',(req,res,next)=>{
  
  let errdata=null;
  db_user.findOne({username:req.body.username},(err,result)=>{
    if(err){
      errdata='查询数据库出错';
      console.log('查询错误: '+err);
      res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
      res.end(errdata);
    }else{
      console.log(result);
      if (result===null) {
        db_user.create({username:req.body.username,password:req.body.password},(err)=>{
          if(err){
            errdata="数据库添加错误";
            console.log('数据库添加错误: '+err);
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
            res.end(errdata);
          }else{
            console.log(req.body.username,req.body.password)
             res.render('user/lg',{base_url:global.base_url,username:req.body.username,password:req.body.password});
          }
        })
      }else{
        errdata="用户名重复"
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.end(errdata);
      }
    }
  })
})

module.exports=router;

