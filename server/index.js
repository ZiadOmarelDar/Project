const express = require ("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UsersModel = require("./models/Users")
const ProductModel = require("./models/ProductModel");
const TravelRequirementModel = require("./models/TravelRequirementModel");


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
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "❌ Invalid data format. Expected an array of products." });
    }

    let newProducts = [];

    for (let product of products) {
      const { productName, price, stockQuantity, category, type } = product;

      if (!productName || !price || stockQuantity === undefined || !type) {
        return res.status(400).json({ message: "❌ All fields are required for each product." });
      }

      const validCategories = ["dogs-food", "cats-food", "accessories"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: `❌ Invalid category: ${category}` });
      }

      const validTypes = {
        "dogs-food": ["Dog Dry food", "Dog Wet food", "Puppy food", "Treats & Snacks"],
        "cats-food": ["Cat Dry food", "Cat Wet food", "Kitten food", "Treats & Snacks"],
        "accessories": ["Dogs", "Cats"]
      };

      if (!validTypes[category]?.includes(type)) {
        return res.status(400).json({ message: `❌ Invalid type for category ${category}: ${type}` });
      }

      const newProduct = await ProductModel.create(product);
      newProducts.push(newProduct);
    }

    res.status(201).json({ message: "✅ Products added successfully", products: newProducts });
  } catch (err) {
    res.status(500).json({ message: "❌ Error adding products", error: err.message });
  }
});


// إضافة متطلبات السفر
app.post("/travel-requirements", async (req, res) => {
  try {
    const { country, documentsRequired, vaccinationsRequired, comfortTips, type } = req.body;

    if (!country || !documentsRequired || !vaccinationsRequired || !comfortTips || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validTypes = ["Dog", "Cat"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid animal type" });
    }

    const newRequirement = new TravelRequirementModel({
      country,
      documentsRequired,
      vaccinationsRequired,
      comfortTips,
      type,
    });

    await newRequirement.save();

    res.status(201).json({ message: "✅ Travel requirement added successfully", requirement: newRequirement });
  } catch (err) {
    res.status(500).json({ message: "❌ Error adding travel requirement", error: err });
  }
});

app.get("/travel-requirements", async (req, res) => {
  try {
    const requirements = await TravelRequirementModel.find();
    res.json(requirements);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching travel requirements", error: err });
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



