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
app.post("/register", async (req, res) => {
    const { email } = req.body;
  
    try {
      const existingUser = await UsersModel.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const newUser = await UsersModel.create(req.body);
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  });
  

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



