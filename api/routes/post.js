const express=require('express');
const router=express.Router();
const checkAuth=require('../middleware/check_auth');
const Profile=require('../../model/Profile');
const {check,validationResult}=require('express-validator');
const User = require('../../model/User');
const Post = require('../../model/Post');

//Post

router.post('/',[
    checkAuth,
    [
    check('text','Text is required').not().isEmpty()
    
    ]
],async(req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }

    try {
        const user=await User.findById(req.user.id);
        const newPost=Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        });
        const post= await newPost.save();
        res.json(post);

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

);
//Get Post
router.get('/',checkAuth,async(req,res)=>{
    try {
        const getPost=await Post.find().sort({date:-1});
        res.json(getPost);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});
//Get PostById

router.get('/:id',checkAuth,async(req,res)=>{
    try {
        const getPost=await Post.findById(req.params.id);

        if(!getPost){
            return res.status(404).json({msg:"Post Not Found"});

        }
        res.json(getPost);
    } catch (err) {
        console.log(err.message);
        if(err.kind==='ObjectId'){
            return res.status(404).json({msg:"Post Not Found"});
            
        }
        res.status(500).send("Server Error");
    }
});

//Delete PostById

router.delete('/:id',checkAuth,async(req,res)=>{
    try {
        const getPost=await Post.findById(req.params.id);

        await getPost.remove();
        res.json({msg:"Post Removed"});

    } catch (err) {
        console.log(err.message);
        
        res.status(500).send("Server Error");
    }
});

//Like
router.put('/like/:id',checkAuth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        //Check if the post has been already liked
        if(post.like.filter(likes=>likes.user.toString()===req.user.id).length>0){
            return res.status(400).json({msg:'Post already liked'});

        }
        post.like.unshift({user:req.user.id});
        await post.save();
        res.json(post.like);
   
    } catch (err) {
        console.log(err.message);
        
        res.status(500).send("Server Error");
    }
});

//UnLike
router.put('/unlike/:id',checkAuth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        //Check if the post has been already liked
        if(post.like.filter(likes=>likes.user.toString()===req.user.id).length===0){
            return res.status(400).json({msg:'Post has not yet been liked'});

        }
        // post.like.unshift({user:req.user.id});
        //Get remove index
        const removeIndex=await post.like.map(likes=>likes.user.toString()).indexOf(req.user.id);
        post.like.splice(removeIndex,1);
        await post.save();
        res.json(post.like);
   
    } catch (err) {
        console.log(err.message);
        
        res.status(500).send("Server Error");
    }
});

//Post comment by Id

router.post('/comment/:id',[
    checkAuth,
    [
    check('text','Text is required').not().isEmpty()
    
    ]
],async(req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }

    try {
        const user=await User.findById(req.user.id);
        const post=await Post.findById(req.params.id);
        const newComment={
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        };
        post.comment.unshift(newComment);
        await post.save();
        res.json(post.comment );

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

);

//Delete api comment/:id/:comment_id

router.delete('/comment/:id/:comment_id',checkAuth,async(req,res)=>{
   
    try {
        const post=await Post.findById(req.params.id);
   
        //Pull Out comment
        const com=await post.comment.find(comments=>comments.id===req.params.comment_id);

        //Make sure comment exit
        if(!com){
            return res.status(404).json({msg:'Comment does not exit'});
        }
        //Check User
        if(com.user.toString()!==req.user.id){
            return res.status(401).json({msg:'User not authorized'});
        }
        const removeIndex=await post.comment.map(comments=>comments.user.toString()).indexOf(req.user.id);
        post.comment.splice(removeIndex,1);
        await post.save();
        res.json(post.comment);

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

);

module.exports=router;