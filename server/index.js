const express = require ("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UsersModel = require("./models/Users")
const ProductModel = require("./models/ProductModel");

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

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
  
// all products
// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find(); // جلب كل المنتجات
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
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


// E-commerc
app.get("/dogs-food", async (req, res) => {
  try {
    const products = await ProductModel.find({ category: "dogs-food" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching dogs food", error: err });
  }
});

// cats food
app.get("/cats-food", async (req, res) => {
  try {
    const products = await ProductModel.find({ category: "cats-food" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cats food", error: err });
  }
});

// Accessories
app.get("/accessories", async (req, res) => {
  try {
    const products = await ProductModel.find({ category: "accessories" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching accessories", error: err });
  }
});
//http://localhost:3001/products

// add product
app.post("/products", async (req, res) => {
  try {
    const { productName, description, price, stockQuantity, image, category, type } = req.body;

    if (!productName || !price || stockQuantity === undefined || !type) {
      return res.status(400).json({ message: "this filed required" });
    }

    const validCategories = ["dogs-food", "cats-food", "accessories"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    
    const validTypes = {
      "dogs-food": ["Dog Dry food", "Dog Wet food", "Puppy food", "Treats & Snacks"],
      "cats-food": ["Cat Dry food", "Cat Wet food", "Kitten food", "Treats & Snacks"],
      "accessories": ["Dogs", "Cats"] 
    };

    if (!validTypes[category]?.includes(type)) {
      return res.status(400).json({ message: `Invalid type for category ${category}` });
    }

   
    const newProduct = new ProductModel({
      productName,
      description,
      price,
      stockQuantity,
      image,
      category,
      type
    });

    await newProduct.save();
    
    res.status(201).json({ message: "✅ Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: "❌ Error adding product", error: err });
  }
});


// 🔹 جلب منتج واحد حسب ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err });
  }
});



app.listen(3001, ()=>{
    console.log("server is running")
})



