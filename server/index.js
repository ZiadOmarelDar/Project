const express = require ("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UsersModel = require("./models/Users")


const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://PetsCare:lDQ6GppZgrBKPZO2@cluster0.ifl5z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{console.log("Mongodb Connected Successfully")})
.catch(err=>console.log(err))

// Register
app.post('/register',(req,res)=>{
    UsersModel.create(req.body)
    .then(Users=>res.json(Users))
    .catch(err=>res.json(err))
})

// Login
app.post('/login',(req,res)=>{
    const {email,password} = req.body
    UsersModel.findOne({email : email})
    .then(user=>{
        if (user) {
            if (user.password === password) {
                res.json('success')
            }else{
                res.json("username or password incorrect")
            }
        }else{
            res.json("No User Existed")
        }
    })
})


app.listen(3001, ()=>{
    console.log("server is running")
})



