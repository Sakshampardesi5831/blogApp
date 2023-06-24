// function updateUserform(){
//   let updateUserContainer_Wrapper_updateProfileEmailAndUsername=document.querySelector(".updateUserContainer_Wrapper_updateProfileEmailAndUsername");
//   updateUserContainer_Wrapper_updateProfileEmailAndUsername.addEventListener("click",function(){
//      updateUserContainer_Wrapper_updateProfileEmailAndUsername.style.display="initial"
//   })
// }
// function closeTheOverlayer(){
//     let close=document.querySelector(".close");
//     let updateUserContainer_Wrapper_updateProfileEmailAndUsername=document.querySelector(".updateUserContainer_Wrapper_updateProfileEmailAndUsername");
//     close.addEventListener("click",function(){
//       updateUserContainer_Wrapper_updateProfileEmailAndUsername.style.display='none';
//     })
// }
// updateUserform();
// closeTheOverlayer()
let show=document.getElementById("showTheBox");
let box=document.querySelector(".updateUserContainer_Wrapper_updateProfileEmailAndUsername");
let closethebox=document.querySelector(".close");
show.addEventListener("click",function(){
  box.style.display="initial"
})
closethebox.addEventListener("click",function(){
  box.style.display="none"
})
