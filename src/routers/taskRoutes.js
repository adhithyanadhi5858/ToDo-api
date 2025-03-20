
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')




router.use("",(req,res,next)=>{
    res.send("working")
    next()
})


const TaskSchema = new mongoose.Schema({
  task: {type : String , default: "Empty Task"}
});

const Task = mongoose.model('Task', TaskSchema);

//Display datas in frond-end
router.get("/",(req,res)=>{
    Task.find()
    .then(items=>{
     res.json(items)
   
    })
    .catch(err=>{
     console.log("Error the promise")
    })
    
   })
   
   
   
   //Add task to database
   router.post("/",( req , res)=>{
   
     const UserTask = req.body.message
      console.log(UserTask)
      Task.create({task: UserTask})
      res.send("Success")
   
   })
   
   
   //Delete method
   router.delete("/task/:id",async (req,res)=>{
   
   const id = req.params.id
   
   const daleteTask = await Task.findByIdAndDelete(id)
   
   console.log("clicked the delete button")
   
     res.send("Deleted")
   })
   
   
   //Update Method
   router.put("/task/update/:id",async(req,res)=>{
    
     const id = req.params.id
     const  updatedData = req.body.message
   
    const task = await Task.findById(id)
   
    task.task = updatedData
    task.save()
     
     console.log("got the id and task")
   
     console.log(`Updating task at Id ${id} with text: ${updatedData}`);
   
   })
   
   module.exports = router
