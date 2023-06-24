var express = require('express');
var router = express.Router();
var userModel=require("./users");
var userDocs=require("./userDocs");
var config=require("../config/config");
var mongoose=require("mongoose");
const LocalStrategy = require("passport-local").Strategy;
const passport=require("passport");
passport.use(new LocalStrategy(userModel.authenticate()));
const mongooseUrl="mongodb://localhost/medium"
const conn = mongoose.createConnection(mongooseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "mediumBucket",
  });
});
/* GET home page. */
router.get('/',redirectToProfile,function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get("/register",function(req,res,next){
  res.render("register");
})
router.post("/register",function(req,res,next){
  let user=new userModel({
      username:req.body.username,
      fullname:req.body.fullname,
      email:req.body.email,
  })
   userModel.register(user, req.body.password).then(function(u){
        console.log(u);
        passport.authenticate("local")(req,res,function(){
            res.redirect("/homepage");
        })
   });
})
router.get("/login",function(req,res){
  res.render("login");
})
router.post("/login",passport.authenticate("local",{
  successRedirect:"/homepage",
  failureRedirect:"/login"
}),function(req,res,next){});
router.get("/profile",isLoggedIn, async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user}).populate("saveDocs");
  let userdocsCreated=await userModel.findOne({username:req.session.passport.user}).populate("createdDocs");

   console.log(user);
   res.render("profile",{user:user,userdocsCreated:userdocsCreated})
});
router.get("/updateUser",isLoggedIn,async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});
  let userdocsCreated=await userModel.findOne({username:req.session.passport.user}).populate("createdDocs");
  res.render("updateUser",{user:user,userdocsCreated:userdocsCreated});
});
router.post("/profile",config.single("image"),isLoggedIn, async function(req,res,next){
   let user=await userModel.findOne({username:req.session.passport.user});
   user.pic=req.file.filename;
   user.bio=req.body.bio;
   let updated=await user.save();
   console.log("updated",updated);
   res.redirect("/updateUser");
});
router.post('/updateEmailUsername',isLoggedIn, async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});
  user.username=req.body.username;
  user.email=req.body.email;
  let updated=await user.save();
  console.log("Updated !!!",updated);
  res.redirect("/updateUser");
});
router.get("/homepage",isLoggedIn, async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});
  let AllDocs=await userDocs.find();
  console.log(AllDocs);
  res.render("homepage",{docs:AllDocs,user:user});
});
router.get("/docs",isLoggedIn, async function(req,res){
  let user=await userModel.findOne({username:req.session.passport.user});
  res.render("createDocs",{user:user})
});
router.post("/docs",isLoggedIn,config.single("image"),async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});

  var data={
    docstitle:req.body.title,
    docsPic:req.file.filename,
    docsContent:req.body.docsContent
  }
 let docsCreated=await userDocs.create(data);
 user.createdDocs.push(docsCreated._id);
 user.save();
//  console.log(docsCreated);
  res.redirect("/homepage");
});
router.get("/docsPics/:filename", (req, res) => {
  const file = gfs
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist",
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
  // console.log(file);
});
router.get("/like/:id",isLoggedIn, async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});
  const id=req.params.id;
  if(user.postLike.indexOf(id)===-1){
       user.postLike.push(id);
  }else{
    user.postLike.splice(user.postLike.indexOf(id),1);
  }
  let postUser=await user.save();
  console.log(postUser);
  res.redirect("back");
});
router.get("/save/:id",isLoggedIn, async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});
  const id=req.params.id;
  if(user.saveDocs.indexOf(id)===-1){
       user.saveDocs.push(id);
  }else{
    user.saveDocs.splice(user.saveDocs.indexOf(id),1);
  }
  let myuser=await user.save();
  console.log(myuser);
  res.redirect("back");
});
router.get("/docsDetail/:id",isLoggedIn, async function(req,res,next){
     let user=await userModel.findOne({username:req.session.passport.user});
     const id=req.params.id;
     let currDocs=await userDocs.findById(id);
     console.log(currDocs);
     res.render("docsDetail",{detail:currDocs,user:user});
});
router.get("/edit/:id",isLoggedIn, async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});
  let userdocsCreated=await userModel.findOne({username:req.session.passport.user}).populate("createdDocs");
  let editDocs=await userDocs.findById(req.params.id);
  const id=req.params.id;
  console.log(editDocs);
  res.render("editDocs",{user:user,editDocs:editDocs,id:id,userdocsCreated:userdocsCreated});
});
router.post("/updateDocs/:id",isLoggedIn,config.single("image"),async function(req,res,next){
    let data={
      docstitle:req.body.title,
      docsPic:req.file.filename,
      docsCreated:req.body.para
    }
    let updatedDocs=await userDocs.findByIdAndUpdate({_id:req.params.id},data);
    console.log(updatedDocs);
     res.redirect("/profile");
})
router.get("/delete/:id",isLoggedIn, async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});
  const id=req.params.id;
  user.createdDocs.splice(user.createdDocs.indexOf(id),1);
  user.save();
  let deleteDocs =await userDocs.findByIdAndDelete({_id:req.params.id});
   console.log(user,deleteDocs);
  res.redirect("/profile");
});
router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}
function redirectToProfile(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/homepage");
  } else {
    return next();
  }
}

module.exports = router;
