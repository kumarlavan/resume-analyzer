require("dotenv").config()
const express=require("express")
const multer=require("multer")
const cors=require("cors")
const processResume = require("./controllers/resumeControllers")

const app=express()
app.use(cors())
app.use(express.json())

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/test",(req,res)=>{
    res.json({message:"server is running fine"})
})

app.post("/analyze-resume",upload.single("resume"),processResume);

module.exports=app
// app.listen(process.env.PORT,()=>{
//     console.log("server is running")
// })