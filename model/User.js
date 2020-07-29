const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const UserSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  avatar:{
    type:String
  },
  password:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    default:Date.now
  }
});

module.exports=mongoose.model('user',UserSchema);
