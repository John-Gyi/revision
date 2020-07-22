var express = require('express');
var router = express.Router();
var User=require('../model/User');
var session = require('express-session');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/new',function(req,res,next){
  res.send('Hello My Friend here');
});
router.get('/useradd',function(req,res,next){
  res.render('user/user_add');
})

router.post('/useradd',function(req,res){
  var user=new User();
  user.name=req.body.name;
  user.email=req.body.email;
  user.password=req.body.password;
  user.save(function(err,rtn){
    if(err) throw err;
    console.log(rtn);
    res.redirect('/users/userlist');
  })
})
router.get('/userlist',function(req,res){
  User.find(function(err,rtn){
    if(err) throw err;
    console.log(rtn);
    res.render('user/user_list',{users:rtn})
  })
})
router.get('/userdetail/:id',function(req,res){
  User.findById(req.params.id,function(err,rtn){
    console.log(rtn);
    if(err) throw err;
    res.render('user/user_detail',{user:rtn});
  })
})
router.get('/userupdate/:id',function(req,res,next){
  User.findById(req.params.id,function(err,rtn){
    if(err) throw err;
    res.render('user/user_update',{user:rtn});
  })
})
router.post('/userupdate',function(req,res,next){
  var update={
    name:req.body.name,
    email:req.body.email,
    password:req.body.password
  };
  User.findByIdAndUpdate(req.body.id,{$set:update},function(err,rtn){
    if(err) throw err;
    console.log(rtn);
    res.redirect('/users/userlist');
  })
})
router.get('/userdelete/:id',function(req,res,next){
  User.findByIdAndRemove(req.params.id,function(err,rtn){
    if(err) throw err;
    res.redirect('/users/userlist');
  })
})
module.exports = router;
