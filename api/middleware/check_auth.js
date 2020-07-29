var jwt=require('jsonwebtoken');
module.exports=function(req,res,next){
    try{
        const token=req.headers.token;
        const decode=jwt.verify(token,'john');
        req.user=decode.user;
        next();
    }catch(error){
        res.status(401).json({
            message:"Token invalid"
        })
    }
}