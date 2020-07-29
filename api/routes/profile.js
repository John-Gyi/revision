const express=require('express');
const router=express.Router();
const checkAuth=require('../middleware/check_auth');
const Profile=require('../../model/Profile');
const {check,validationResult}=require('express-validator');
const User = require('../../model/User');

router.get('/me',checkAuth,
async(req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'});
        }
        res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}
);

router.post('/',[checkAuth,[
    check('status','Status is required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty(),

]
],
async(req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }
    const{
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    }=req.body;

    //Build profile object
    const profileFields={};
    profileFields.user=req.user.id;
    if(company) profileFields.company=company;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(website) profileFields.website=website;

    if(skills){
        profileFields.skills=skills.split(',').map(skill=>skill.trim());
        
    }

    //Build Social Object
    profileFields.social={};
    if(youtube) profileFields.social.youtube=youtube;
    if(twitter) profileFields.social.twitter=twitter;
    if(linkedin) profileFields.social.linkedin=linkedin;
    if(instagram) profileFields.social.instagram=instagram;
    if(facebook) profileFields.social.youtube=facebook;

    try{
        let profile=await Profile.findOne({user:req.user.id});
        if(profile){
            //update
            profile=await Profile.findOneAndUpdate(
               {user:req.user.id},
               {$set:profileFields},
               {new:true}

            );
            return res.json(profile);
        }

        //Create
        profile=new Profile(profileFields);
        await profile.save();
        res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
    // console.log(profileFields.skills);
    // res.send('Hey Baby');
});
//populate
router.get('/',async(req,res)=>{
    try {
        const profiles=await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

//get byId
router.get('/user/:id',async(req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.params.id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'});
        }
        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})
//Delete

router.delete('/',checkAuth,async(req,res)=>{
    try {
        //Remove Profile
        await Profile.findOneAndDelete({user:req.user.id});
        //Remove User
        await User.findOneAndDelete({_id:req.user.id});
        res.json({msg:'User Deleted'});
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})


//Put experience

router.put('/experience',
[checkAuth,
    [
        check('title','Title is required').not().isEmpty(),
        check('company','Company is required').not().isEmpty(),
        check('from','From Date is required').not().isEmpty(),
    ]
],
async(req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }

    const{
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }=req.body;
    
    const newExp={
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };
    try {
        const profile=await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);

        await profile.save();
        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}
);

//Delete Experience
router.delete('/experience/:id',checkAuth,async(req,res)=>{
    try {
        
        const profile=await Profile.findOne({user:req.user.id});
        //Get Remove Index
       const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.id);

       profile.experience.splice(removeIndex,1);
       await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

//Post education
router.put('/education',
[checkAuth,
    [
        check('school','School is required').not().isEmpty(),
        check('degree','Degree is required').not().isEmpty(),
        check('fieldofstudy','Field of study is required').not().isEmpty(),
        check('from','From Date is required').not().isEmpty(),
    ]
],
async(req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }

    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }=req.body;
    
    const newEdu={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };
    try {
        const profile=await Profile.findOne({user:req.user.id});
        profile.education.unshift(newEdu);

        await profile.save();
        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}
);

//Delete Education
router.delete('/education/:id',checkAuth,async(req,res)=>{
    try {
        
        const profile=await Profile.findOne({user:req.user.id});
        //Get Remove Index
       const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.id);

       profile.education.splice(removeIndex,1);
       await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})
module.exports=router;