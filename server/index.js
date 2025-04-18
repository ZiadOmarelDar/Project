const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsersModel = require("./models/Users");
const ProductModel = require("./models/ProductModel");
const TravelRequirementModel = require("./models/TravelRequirementModel");
const PostModel = require("./models/PostModel");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Mongo DB Connection
mongoose
  .connect(
    "mongodb+srv://PetsCare:lDQ6GppZgrBKPZO2@cluster0.ifl5z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// -----------------------------------------------------------------------------------------------------------------------

// JWT Handling
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ----------------------------------------------------------------------------------------------------------------------

app.post("/register", async (req, res) => {
  const { name, userType, username, email, password } = req.body;

  try {
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields (name, email, password, username) are required" });
    }

    const validUserTypes = ["user", "clinicAdmin", "trainer"];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingUsername = await UsersModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UsersModel.create({
      name,
      userType,
      username,
      email,
      password: hashedPassword,
      cart: [],
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, email: newUser.email, username: newUser.username },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Get user info
app.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.userId).select("username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user data", error: err.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
});

app.get("/dogs-food", async (req, res) => {
  try {
    const products = await ProductModel.find({ category: "dogs-food" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching dogs food", error: err.message });
  }
});

app.get("/cats-food", async (req, res) => {
  try {
    const products = await ProductModel.find({ category: "cats-food" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cats food", error: err.message });
  }
});

app.get("/accessories", async (req, res) => {
  try {
    const products = await ProductModel.find({ category: "accessories" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching accessories", error: err.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid data format. Expected an array of products." });
    }

    let newProducts = [];

    for (let product of products) {
      const { productName, price, stockQuantity, category, type } = product;

      if (!productName || !price || stockQuantity === undefined || !type) {
        return res.status(400).json({ message: "All fields are required for each product." });
      }

      const validCategories = ["dogs-food", "cats-food", "accessories"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: `Invalid category: ${category}` });
      }

      const validTypes = {
        "dogs-food": ["Dog Dry food", "Dog Wet food", "Puppy food", "Treats & Snacks"],
        "cats-food": ["Cat Dry food", "Cat Wet food", "Kitten food", "Treats & Snacks"],
        "accessories": ["Dogs", "Cats"],
      };

      if (!validTypes[category]?.includes(type)) {
        return res.status(400).json({ message: `Invalid type for category ${category}: ${type}` });
      }

      const newProduct = await ProductModel.create(product);
      newProducts.push(newProduct);
    }

    res.status(201).json({ message: "Products added successfully", products: newProducts });
  } catch (err) {
    res.status(500).json({ message: "Error adding products", error: err.message });
  }
});

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

    res.status(201).json({ message: "Travel requirement added successfully", requirement: newRequirement });
  } catch (err) {
    res.status(500).json({ message: "Error adding travel requirement", error: err.message });
  }
});

app.get("/travel-requirements", async (req, res) => {
  try {
    const requirements = await TravelRequirementModel.find();
    res.json(requirements);
  } catch (err) {
    res.status(500).json({ message: "Error fetching travel requirements", error: err.message });
  }
});

app.post("/cart/add", authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: "Product ID and quantity are required" });
  }

  try {
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity = quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    await user.populate("cart.productId");
    res.json({ message: "Product added to cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
});


app.get("/cart", authMiddleware, async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.populate("cart.productId"); // التأكد إن productId متعبّى بكل التفاصيل
    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
});

app.delete("/cart/remove/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params;

  try {
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();
    await user.populate("cart.productId");
    res.json({ message: "Product removed from cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart", error: err.message });
  }
});

// --------------------------------------------------------------------------------------------------

// Community Feature

// Add a new post
app.post("/posts", authMiddleware, async (req, res) => {
  try {
    const { title, content, image } = req.body;

    if (!content) {
      return res.status(400).json({ message: "content is required" });
    }

    const newPost = await PostModel.create({
      title,
      content,
      image,
      author: req.user.userId,
    });

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    res.status(500).json({ message: "Error creating post", error: err.message });
  }
});

// Get all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("author", "username email") // show user details
      .sort({ createdAt: -1 }); // newest first

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
});


// ----------------------------------------------------------------------------------------------------

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});