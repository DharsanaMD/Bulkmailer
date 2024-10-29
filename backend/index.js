const express = require("express")
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const app = express()

app.use(cors())

app.use(express.json())
// mongoose.connect("mongodb://127.0.0.1:27017/passkey")     istead of this used mongodb cloud link
//mongoose.connect("mongodb+srv://Dharsana:dharsana1106@cluster0.bvv7pty.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
mongoose.connect("mongodb://127.0.0.1:27017/passkey").then(function(){
    console.log("Connected to db")
}).catch(function(error){
    console.log(error+"Failed to connect db")
})

const credential = mongoose.model("credential",{},"bulkmail")





// async..await is not allowed in global scope, must use a wrapper

app.post("/sendemail",function(req,res){
    var msg=req.body.msg
    var emailList=req.body.emailList
    console.log(msg)
    credential.find().then(function(data){
       

        const transporter = nodemailer.createTransport({
            service:"gmail",
          auth: {
            user: data[0].toJSON().user,
            pass: data[0].toJSON().pass,
          },
        });
    
        new Promise (async function(resolve,reject){
            try{
                for(var i=0;i<emailList.length;i++){
                    await transporter.sendMail(
                        {
                            from:"dhachudevi444@gmail.com",
                            to:emailList[i],
                            subject:"Msg from BulkMail App",
                            text:msg
                        },
                       
                    )
                    console.log("Email sent to "+emailList[i])
                }
                resolve("Success")
            }
            catch(error){
                reject("Failes")
            }
        }).then(function(){
            res.send(true)
        }).catch(function(){
            res.send(false)
        })
    }).catch(function(error){
        console.log(error)
    })
  
   
   
    
})
app.listen(5000,function(){
    console.log("Server started")
})