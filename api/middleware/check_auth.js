var jwt=require('jsonwebtoken');
module.exports=function(req,res,next){
    try{
        var token=req.headers.token;
        var decode=jwt.verify(token,'john');
        next();
    }catch(error){
        res.status(401).json({
            message:"Hey U can't access before signin"
        })
    }
}