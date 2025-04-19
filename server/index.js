const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsersModel = require("./models/Users");
const ProductModel = require("./models/ProductModel");
const TravelRequirementModel = require("./models/TravelRequirementModel");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://PetsCare:lDQ6GppZgrBKPZO2@cluster0.ifl5z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// تعريف الـ Secret Key بشكل ثابت
const JWT_SECRET = "yourSecretKey";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

app.post("/register", async (req, res) => {
  const { name, userType, username, email, password } = req.body;

  try {
    // التحقق من وجود كل الحقول
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields (name, username, email, password) are required" });
    }

    // التحقق من نوع المستخدم
    const validUserTypes = ["user", "clinicAdmin", "trainer"];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // التحقق من الإيميل واليوزرنيم (مش موجودين قبل كده)
    const existingUser = await UsersModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // تشفير كلمة السر
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء مستخدم جديد
    const newUser = await UsersModel.create({
      name,
      userType,
      username,
      email,
      password: hashedPassword,
      cart: [],
    });

    // إنشاء توكن
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        userType: newUser.userType,
      },
      token,
    });
  } catch (err) {
    // معالجة أخطاء الـ schema validation من mongoose
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
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
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get user info
app.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user data", error: err.message });
  }
});

// Endpoint لجلب الخدمات بتاعة المستخدم
app.get("/user/services", authMiddleware, async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.userId).select("services userType");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ userType: user.userType, services: user.services });
  } catch (err) {
    res.status(500).json({ message: "Error fetching services", error: err.message });
  }
});

// إضافة خدمة جديدة
app.post("/user/services", authMiddleware, async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let serviceData = { contactInfo: req.body.contactInfo };

    if (user.userType === "clinicAdmin") {
      serviceData = {
        ...serviceData,
        type: "clinic",
        clinicName: req.body.clinicName,
        doctorName: req.body.doctorName,
        location: req.body.location,
        workingHours: req.body.workingHours,
        servicePrice: req.body.servicePrice,
        currency: req.body.currency,
        serviceType: req.body.serviceType,
        doctorDescription: req.body.doctorDescription,
      };
    } else if (user.userType === "trainer") {
      serviceData = {
        ...serviceData,
        type: "trainer",
        trainerName: user.name,
        specialty: req.body.specialty,
        availablePrograms: req.body.availablePrograms,
      };
    }

    // إضافة الخدمة للـ services array في الـ user
    user.services.push(serviceData);
    await user.save();

    res.status(201).json({ service: serviceData });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// تعديل خدمة موجودة
app.put("/user/services/:index", authMiddleware, async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const serviceIndex = parseInt(req.params.index);
    if (serviceIndex < 0 || serviceIndex >= user.services.length) {
      return res.status(404).json({ message: "Service not found" });
    }

    let serviceData = { contactInfo: req.body.contactInfo };

    if (user.userType === "clinicAdmin") {
      serviceData = {
        ...serviceData,
        type: "clinic",
        clinicName: req.body.clinicName,
        doctorName: req.body.doctorName,
        location: req.body.location,
        workingHours: req.body.workingHours,
        servicePrice: req.body.servicePrice,
        currency: req.body.currency,
        serviceType: req.body.serviceType,
        doctorDescription: req.body.doctorDescription,
      };
    } else if (user.userType === "trainer") {
      serviceData = {
        ...serviceData,
        type: "trainer",
        trainerName: user.name,
        specialty: req.body.specialty,
        availablePrograms: req.body.availablePrograms,
      };
    }

    // تحديث الخدمة في الـ services array
    user.services[serviceIndex] = serviceData;
    await user.save();

    res.status(200).json({ service: serviceData });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete service
app.delete("/user/services/:index", authMiddleware, async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const serviceIndex = parseInt(req.params.index);
    if (isNaN(serviceIndex) || serviceIndex < 0 || serviceIndex >= user.services.length) {
      return res.status(400).json({ message: "Invalid service index" });
    }

    user.services.splice(serviceIndex, 1);
    await user.save();

    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting service", error: err.message });
  }
});

// user update
app.put("/user/update", authMiddleware, async (req, res) => {
  const { name, username, email } = req.body;

  try {
    // التحقق من وجود كل الحقول
    if (!name || !username || !email) {
      return res.status(400).json({ message: "Name, username, and email are required" });
    }

    // التحقق من عدم وجود إيميل أو يوزرنيم مستخدمين قبل كده (باستثناء المستخدم الحالي)
    const existingUser = await UsersModel.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: req.user.userId }, // استثناء المستخدم الحالي
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // البحث عن المستخدم وتحديث بياناته
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.username = username;
    user.email = email;
    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    // معالجة أخطاء الـ schema validation من mongoose
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Error updating profile", error: err.message });
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
    await user.populate("cart.productId");
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

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});