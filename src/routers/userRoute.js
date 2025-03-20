const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')


   //user model and schema........


   const UserSchema = new mongoose.Schema({
    email: {type : String , unique:true },
    password : {type : String },
    username: {type : String }
  });
  
  const User = mongoose.model('User', UserSchema);
  
  
  router.get("/", async (req,res)=>{
  
   const users = await User.find()
  
   res.json(users)
   
  })
  
  
  
  router.post("/register",  (req,res)=>{
    
    const pass = req.body.password
    console.log(req.body)
    bcrypt.hash(pass, saltRounds, async function(err, hash) {
      if(hash){
        const newUser= await User.create({...req.body,password:hash})
        res.send({message : "Register Completed Successfully"})
      }else{
         res.status(401).json({message:"Something Went wrong"})
      }
     
  });
     
  })
  
  
  
  
  router.post("/login", async(req,res)=>{
      
       const email = req.body.email
       const password = req.body.password
      
       const user = await User.findOne({email:email}) 
       console.log(user)
      
       bcrypt.compare(password, user.password, function(err, result) {
       if(result){
        res.json({message:"Logged successfully"})
       }else{
        res.status(400).json({message:"Not found"})
       }
    });
  
     
  })
  
  
  router.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id  
  
   await User.findByIdAndDelete(id)
      res.send("deleted")
    })
module.exports = router