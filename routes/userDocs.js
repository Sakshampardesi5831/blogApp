var mongoose =require("mongoose");

var userDocs=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    docstitle:String,
    docsPic:String,
    docsContent:String,
    userLike:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    
})

module.exports=mongoose.model("docs",userDocs);