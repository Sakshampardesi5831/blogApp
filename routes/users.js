var mongoose=require("mongoose");
var plm=require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/medium").then(function(){
    console.log("connected to db");
})

var userSchema=mongoose.Schema({
  username:String,
  password:String,
  fullname:String,
  email:String,
  pic:String,
  bio:String,
  createdDocs:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"docs"
  }],
  saveDocs:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"docs"
  }],
  postLike:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"docs"
  }]
})
userSchema.plugin(plm);
module.exports=mongoose.model("user",userSchema);