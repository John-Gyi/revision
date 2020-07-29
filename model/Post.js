const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const PostSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    text:{
        type:String,
         required:true
     },
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },    
    like:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'user'
            }, 
        }
    ],
    comment:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'user'
            },
            text:{
                type:String,
                required:true
            },
            name:{
                type:String,
                required:true
            },
            avatar:{
                type:String
            },    
            date:{
                type:Date,
                default:Date.now
              }

        }
    ],
  date:{
    type:Date,
    default:Date.now
  }
});

module.exports=mongoose.model('post',PostSchema);
