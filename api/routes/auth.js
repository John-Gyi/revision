const express=require('express');
const router=express.Router();
const User=require('../../model/User');
const bcrypt=require('bcryptjs');
const checkAuth=require('../middleware/check_auth');
const jwt=require('jsonwebtoken');
// const config=require('config');
const {check,validationResult}=require('express-validator');

    // router.get('/',checkAuth,function(req,res){
    //     User.find(function(err,rtn){
    //       if(err){
    //         res.status(500).json({
    //           message:"Internal Server Error",
    //           error:err
    //         })
    //       }else {
    //         res.status(200).json({
    //           users:rtn
    //         })
    //       }
    //     })
    //   })

    router.get('/',checkAuth,
    async(req,res)=>{
      try{
        const user=await User.findById(req.user.id);
        res.json(user);
      }catch(err){
        res.status(500).json({
                    message:"Server Error",
                    error:err
          })


      }
    }

    );

      router.post('/',[
    
        check('email','Please include a valid email').isEmail(),
        check('password','Password Required').exists()
      
      ], 
      async(req,res)=>{
        // console.log(req.body);
        const errors=validationResult(req);
      
        if(!errors.isEmpty()){
          return res.status(400).json({errors:errors.array()});
        }
        const{email,password}=req.body;
      
        try{
          let user=await User.findOne({email});
          if(!user){
            res.status(400).json({errors:[{msg:'Invalid Credential'}]});
          }
    

          const isMatch=await bcrypt.compare(password,user.password);
          if(!isMatch){
            res.status(400).json({errors:[{msg:'Invalid Credential'}]});
          }
          const payload={
            user:{
              id:user.id
            }
          };
      //     // jwt.sign(payload,config.get('jwtSecret'),{expiresIn:36000},(err,token)=>{
      //     //   if(err) throw err;
      //     //   res.json({token});
      //     // });
          const token=jwt.sign(
            payload
            ,
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