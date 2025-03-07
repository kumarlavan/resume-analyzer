require("dotenv").config()
const express=require("express")
const multer=require("multer")
const cors=require("cors")
const processResume = require("./controllers/resumeControllers")

const app=express()
app.use(cors())
app.use(express.json())


const upload=multer({dest:"uploads/"})


app.post("/analyze-resume",upload.single("resume"),processResume);

module.exports=app