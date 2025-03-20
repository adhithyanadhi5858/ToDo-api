const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const saltRounds = 10;
const app = express()
const port = 3000
const encryptKey = "7149868641"

mongoose.connect('mongodb+srv://AdithyanK:8606630069@cluster0.apqwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(res=>{
  console.log("Mongoose connected")
})
.catch(err=>{
  console.log("Mongoose not connected")
})


app.use(cors({
  origin: 'http://localhost:5173'
}))


app.use(express.json())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

app.get("",(req,res)=>{
  res.send("Hello World")
})

const upload = multer({ storage });

const fs = require('fs')
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Respond with the URL of the uploaded image
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});



const TaskSchema = new mongoose.Schema({
  task: {type : String , default: "Empty Task"},
 userId : {
      type:mongoose.Schema.Types.ObjectId,
      ref: "User"
 }
});

const Task = mongoose.model('Task', TaskSchema);

//Display datas in frond-end
app.get("/",async(req,res)=>{

  let token = req.headers.authorization
  var decoded = jwt.verify(token, encryptKey);
      const user = await User.findOne({email:decoded.email})
    Task.find({userId:user._id})
    .then(items=>{
     res.json(items)
   
    })
    .catch(err=>{
     console.log("Error the promise")
    })
    
   })
   
  
   
   
   //Add task to database
   app.post("/",async( req , res)=>{
    const token = req.body.token
     const UserTask = req.body.message
      console.log("New Task -",UserTask)

      var decoded = jwt.verify(token, encryptKey);
      const user = await User.findOne({email:decoded.email})

      Task.create({task: UserTask , userId: user._id})
      res.send("Success")
   
   })
   
   
   //Delete method
   app.delete("/task/:id",async (req,res)=>{
   
   const id = req.params.id
   
   const daleteTask = await Task.findByIdAndDelete(id)
   
   console.log("clicked the delete button")
   
     res.send("Deleted")
   })
   
   
   
   //Update Method
   app.put("/task/update/:id",async(req,res)=>{
    
     const id = req.params.id
     const  updatedData = req.body.message
   
    const task = await Task.findById(id)
   
    task.task = updatedData
    task.save()
     
     console.log("got the id and task")
   
     console.log(`Updating task at Id ${id} with text: ${updatedData}`);
   
   })

   //user model and schema........


   const UserSchema = new mongoose.Schema({
    email: {type : String , unique:true },
    password : {type : String },
    username: {type : String }
  });
  
  const User = mongoose.model('User', UserSchema);
  
  
 app.get("/user", async (req,res)=>{
  
   const users = await User.find()
  
   res.json(users)
   
  })
  
  
  
 app.post("/register",  (req,res)=>{
    
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
  
  
  
  
  app.post("/login", async(req,res)=>{
      
       const email = req.body.email
       const password = req.body.password
      
       const user = await User.findOne({email:email}) 
       console.log(user)
       
       bcrypt.compare(password, user.password, function(err, result) {
       if(result){
        var token = jwt.sign({ email:email }, encryptKey);
        res.json({message:"Logged successfully" , token:token})
       }else{
        res.status(404).json({message:"Not found"})
       }
    });
  
     
  })

  app.post("/check-token",(req,res)=>{
     const token = req.body.token
     
     var decoded = jwt.verify(token, encryptKey);
     console.log(decoded)
     if(decoded.email){
      res.send("Token verification successfull")
     }else{
      res.status(404).json({message:"User Invalid"})
     }

     


  })

 

  
  
 app.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id  
  
   await User.findByIdAndDelete(id)
      res.send("deleted")
    })

  



app.listen(port, ()=>{
  console.log(`Working port : ${port}`)
})