const express = require('express');
const router = express.Router();
const bcrypt=require('bcryptjs');
const gravatar=require('gravatar');
const User=require('../../model/User');
const jwt=require('jsonwebtoken');
// const config=require('config');
const {check,validationResult}=require('express-validator');
// const checkAuth=require('../middleware/check_auth');


// router.get('/list',checkAuth,function(req,res){
//   console.log('hi');
//   User.find(function(err,rtn){
//     if(err){
//       res.status(500).json({
//         message:"Internal Server Error",
//         error:err
//       })
//     }else {
//       res.status(200).json({
//         users:rtn
//       })
//     }
//   })
// })
router.post('/',[
  check('name','Name is required').not().isEmpty(),
  check('email','Please include a valid email').isEmail(),
  check('password','Please enter a password with 6 or more characters').isLength({min:6})

], 
async(req,res)=>{
  // console.log(req.body);
  const errors=validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const{name,email,password}=req.body;

  try{
    let user=await User.findOne({email});
    if(user){
      res.status(400).json({errors:[{msg:'User already exit'}]});
    }
    const avatar=gravatar.url(email,{
      s:'200',
      r:'pg',
      d:'mm'
    });
    user=new User({
      name,
      email,
      avatar,
      password
    });
    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(password,salt);

    await user.save();

    const payload={
      user:{
        id:user.id
      }
    };
    // jwt.sign(payload,config.get('jwtSecret'),{expiresIn:36000},(err,token)=>{
    //   if(err) throw err;
    //   res.json({token});
    // });
    const token=jwt.sign(
      
      payload,
    "john",
      {
      expiresIn:"7hr"
      }
      );
  res.status(200).json({
  message:'Success',
  token:token
})

  }catch(err){
    console.log(err.message);
    res.status(500).send('Server Error');
  }
  
})
module.exports=router;