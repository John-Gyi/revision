var express = require('express');
var router = express.Router();
var Admin=require('../model/Admin');
var mongoose=require('mongoose');
var session=require('express-session');
var validator=require('email-validator');
var passwordValidator=require('password-validator');
var schema = new passwordValidator();
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Revision' });
});

router.get('/signup',function(req,res,next){
  res.render('sign_up');
})
router.get('/signin',function(req,res,next){
  res.render('sign_in');
})
router.post('/signup',function(req,res,next){
  var admin=new Admin();
  admin.name=req.body.name;
  admin.email=req.body.email;
  admin.password=req.body.password;

  admin.save(function(err,rtn){
    if(err) throw err;
    console.log(rtn);
    res.redirect('/signin');
  })
})
router.post('/signin',function(req,res,next){
  Admin.findOne({email:req.body.email},function(err,rtn){
    if (err) throw err;
    console.log(rtn);
    if(rtn !=null && Admin.compare(req.body.password,rtn.password)){
      req.session.user={name:rtn.name,email:rtn.email};
      res.redirect('/');
    }else{
      res.redirect('/signin');
    }
  })
})
router.post('/duemail',function(req,res,next){
  Admin.findOne({email:req.body.email1},function(err,rtn){
    if(err) throw err;
    if(rtn !=null ||!validator.validate(req.body.email1)){
      res.json({status:true})
    }else{
      res.json({status:false})
    }
  })
})
router.post('/passval',function(req,res){
  res.json({status:schema.validate(req.body.password1)});
})


module.exports = router;
