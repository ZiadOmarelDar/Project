const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsersModel = require("./models/Users");
const ProductModel = require("./models/ProductModel");
const TravelRequirementModel = require("./models/TravelRequirementModel");
const PostModel = require("./models/PostModel");
const multer = require("multer");
const ftp = require("ftp");
const path = require("path");
const fs = require("fs");
const PetModel = require("./models/PetModel");


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/uploads/clinic-photos", express.static(path.join(__dirname, "uploads", "clinic-photos")));

// Mongo DB Connection
mongoose
  .connect(
    "mongodb+srv://PetsCare:lDQ6GppZgrBKPZO2@cluster0.ifl5z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));


const JWT_SECRET = "yourSecretKey";

// Token Checker
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }
  try {
    const decoded = jwt.verify(token, "your-secret-key");
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid token. Please log in again." });
  }
};


const uploadPosts = multer({ dest: "uploads/" });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "Uploads", "users");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadUsers = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG images are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});


// Multer for clinic photos
const storageClinics = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads", "clinic-photos");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadClinics = multer({
  storage: storageClinics,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG images are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const petsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "Uploads", "Pets");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = file.originalname;
    cb(null, uniqueName);
  },
});

const uploadPets = multer({
  storage: petsStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG images are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Register
app.post("/register", async (req, res) => {
  const { name, userType, username, email, password } = req.body;
  try {
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields (name, username, email, password) are required" });
    }
    const validUserTypes = ["user", "clinicAdmin", "trainer"];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }
    const existingUser = await UsersModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UsersModel.create({
      name,
      userType,
      username,
      email,
      password: hashedPassword,
      userPhoto: "not found",
      cart: [],
    });
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, username: newUser.username, email: newUser.email, userType: newUser.userType, userPhoto: newUser.userPhoto },
      token,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, "your-secret-key", { expiresIn: "5m" });
    res.json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// Get User Info
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

// Add User Photo
app.post("/user/upload-photo", authMiddleware, uploadUsers.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const imageUrl = `/uploads/users/${req.file.filename}`;
    user.userPhoto = imageUrl;
    await user.save();
    res.status(200).json({ message: "Profile photo uploaded successfully", imageUrl });
  } catch (err) {
    res.status(500).json({ message: "Error uploading photo", error: err.message });
  }
});

// delete photo
app.delete("/user/remove-photo", authMiddleware, async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.userPhoto && user.userPhoto !== "not found") {
      const photoPath = path.join(__dirname, "uploads", user.userPhoto.split("/uploads/")[1]);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    user.userPhoto = "not found";
    await user.save();
    res.json({ message: "Profile photo removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error removing photo", error: err.message });
  }
});

// Get User Info
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

// Add new service with adding clinic photo
app.post("/user/services", authMiddleware, uploadClinics.array("clinicPhotos", 5), async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { mobile, email, location, specialties } = req.body;
    if (!mobile || !email) {
      return res.status(400).json({ message: "Mobile and email are required" });
    }

    if (!/^\+201[0125]\d{8}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number. Use format +2010129398859." });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    let serviceData = { mobile, email };

    if (user.userType === "clinicAdmin") {
      const { clinicName, doctorName, workingHours, servicePrice, currency, serviceType, doctorDescription } = req.body;
      if (!clinicName || !doctorName || !location || !workingHours || !servicePrice || !currency || !serviceType || !doctorDescription || !specialties) {
        return res.status(400).json({ message: "All clinic fields are required" });
      }
      if (isNaN(parseFloat(servicePrice)) || parseFloat(servicePrice) <= 0) {
        return res.status(400).json({ message: "Service price must be a positive number" });
      }
      if (!["EGP", "USD"].includes(currency)) {
        return res.status(400).json({ message: "Currency must be EGP or USD" });
      }
      const clinicPhotos = req.files ? req.files.map(file => `/uploads/clinic-photos/${file.filename}`) : [];
      serviceData = {
        ...serviceData,
        type: "clinic",
        clinicName,
        doctorName,
        location: {
          governorate: location.governorate,
          specificLocation: location.specificLocation,
        },
        workingHours,
        servicePrice,
        currency,
        serviceType,
        doctorDescription,
        clinicPhotos,
        specialties: Array.isArray(specialties) ? specialties : [specialties],
      };
    } else if (user.userType === "trainer") {
      const { specialty, availablePrograms } = req.body;
      if (!specialty || !availablePrograms) {
        return res.status(400).json({ message: "Specialty and at least one program are required" });
      }
      if (!["Obedience Training", "Agility Training", "Behavioral Correction", "Puppy Training", "Trick Training"].includes(specialty)) {
        return res.status(400).json({ message: "Invalid specialty" });
      }
      const programs = Array.isArray(availablePrograms) ? availablePrograms : [availablePrograms];
      if (programs.length === 0) {
        return res.status(400).json({ message: "At least one program (Private Sessions or Online Training) is required" });
      }
      const validPrograms = ["Private Sessions", "Online Training"];
      const invalidPrograms = programs.filter(program => !validPrograms.includes(program));
      if (invalidPrograms.length > 0) {
        return res.status(400).json({ message: `Invalid programs: ${invalidPrograms.join(", ")}` });
      }
      serviceData = {
        ...serviceData,
        type: "trainer",
        trainerName: user.name,
        specialty,
        availablePrograms: programs,
      };
    } else {
      return res.status(403).json({ message: "User type not authorized to add services" });
    }

    serviceData._id = new mongoose.Types.ObjectId();
    user.services.push(serviceData);
    await user.save();

    res.status(201).json({ service: serviceData });
  } catch (err) {
    res.status(400).json({ message: "Error adding service", error: err.message });
  }
});

// update service with adding clinic photo
app.put("/user/services/:serviceId", authMiddleware, uploadClinics.array("clinicPhotos", 5), async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const serviceId = req.params.serviceId;
    const service = user.services.find(s => s._id.toString() === serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const { mobile, email, location, specialties } = req.body;
    if (!mobile || !email) {
      return res.status(400).json({ message: "Mobile and email are required" });
    }

    if (!/^\+201[0125]\d{8}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number. Use format +2010129398859." });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    let serviceData = { _id: service._id, mobile, email };
    if (user.userType === "clinicAdmin") {
      const { clinicName, doctorName, workingHours, servicePrice, currency, serviceType, doctorDescription } = req.body;
      if (!clinicName || !doctorName || !location || !workingHours || !servicePrice || !currency || !serviceType || !doctorDescription || !specialties) {
        return res.status(400).json({ message: "All clinic fields are required" });
      }
      if (isNaN(parseFloat(servicePrice)) || parseFloat(servicePrice) <= 0) {
        return res.status(400).json({ message: "Service price must be a positive number" });
      }
      if (!["EGP", "USD"].includes(currency)) {
        return res.status(400).json({ message: "Currency must be EGP or USD" });
      }
      const clinicPhotos = req.files ? req.files.map(file => `/uploads/clinic-photos/${file.filename}`) : service.clinicPhotos;
      serviceData = {
        ...serviceData,
        type: "clinic",
        clinicName,
        doctorName,
        location: { governorate: location.governorate, specificLocation: location.specificLocation },
        workingHours,
        servicePrice,
        currency,
        serviceType,
        doctorDescription,
        clinicPhotos,
        specialties: Array.isArray(specialties) ? specialties : [specialties],
      };
    } else if (user.userType === "trainer") {
      const { specialty, availablePrograms } = req.body;
      if (!specialty || !availablePrograms) {
        return res.status(400).json({ message: "Specialty and at least one program are required" });
      }
      if (!["Obedience Training", "Agility Training", "Behavioral Correction", "Puppy Training", "Trick Training"].includes(specialty)) {
        return res.status(400).json({ message: "Invalid specialty" });
      }
      const programs = Array.isArray(availablePrograms) ? availablePrograms : [availablePrograms];
      if (programs.length === 0) {
        return res.status(400).json({ message: "At least one program (Private Sessions or Online Training) is required" });
      }
      const validPrograms = ["Private Sessions", "Online Training"];
      const invalidPrograms = programs.filter(program => !validPrograms.includes(program));
      if (invalidPrograms.length > 0) {
        return res.status(400).json({ message: `Invalid programs: ${invalidPrograms.join(", ")}` });
      }
      serviceData = {
        ...serviceData,
        type: "trainer",
        trainerName: user.name,
        specialty,
        availablePrograms: programs,
      };
    } else {
      return res.status(403).json({ message: "User type not authorized to update services" });
    }
    const serviceIndex = user.services.findIndex(s => s._id.toString() === serviceId);
    user.services[serviceIndex] = serviceData;
    await user.save();
    res.status(200).json({ service: serviceData });
  } catch (err) {
    res.status(400).json({ message: "Error updating service", error: err.message });
  }
});

// Delete service
app.delete("/user/services/:serviceId", authMiddleware, async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const serviceId = req.params.serviceId;
    const serviceIndex = user.services.findIndex(s => s._id?.toString() === serviceId);
    if (serviceIndex === -1) {
      return res.status(400).json({ message: "Invalid service ID" });
    }
    user.services.splice(serviceIndex, 1);
    await user.save();
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting service", error: err.message });
  }
});

// Get all clinics
app.get("/user/all-clinics", authMiddleware, async (req, res) => {
  try {
    const clinics = await UsersModel.find({ userType: "clinicAdmin", "services.0": { $exists: true } })
      .select("services")
      .lean();
    const allClinics = clinics.flatMap(user => user.services.filter(s => s.type === "clinic"));
    const clinicsWithPhotos = allClinics.map(clinic => ({
      ...clinic,
      clinicPhotos: clinic.clinicPhotos || [],
    }));
    res.status(200).json({ clinics: clinicsWithPhotos });
  } catch (err) {
    res.status(500).json({ message: "Error fetching clinics", error: err.message });
  }
});

// Get single clinic
app.get("/user/all-clinics/:id", authMiddleware, async (req, res) => {
  try {
    const clinics = await UsersModel.find({ userType: "clinicAdmin", "services.0": { $exists: true } })
      .select("services")
      .lean();
    const allClinics = clinics.flatMap(user => user.services.filter(s => s.type === "clinic"));
    const clinic = allClinics.find(c => c._id.toString() === req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    const adminUser = await UsersModel.findOne({ services: { $elemMatch: { _id: req.params.id } } }).select("_id");
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found for this clinic" });
    }
    const clinicWithAdmin = {
      ...clinic,
      adminId: adminUser._id.toString(), 
    };
    res.status(200).json({ clinic: clinicWithAdmin });
  } catch (err) {
    res.status(500).json({ message: "Error fetching clinic", error: err.message });
  }
});

// Get Doctor Info (Admin Details)
app.get('/admin/:id', authMiddleware, async (req, res) => {
  try {
    const admin = await UsersModel.findById(req.params.id).select("-password");
    if (!admin || admin.userType !== "clinicAdmin") {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all trainers have services
app.get("/user/trainers", authMiddleware, async (req, res) => {
  try {
    const trainers = await UsersModel.find({ userType: "trainer", "services.0": { $exists: true } }).select("-password");
    if (!trainers || trainers.length === 0) {
      return res.status(404).json({ message: "No trainers found" });
    }
    res.status(200).json({ trainers });
  } catch (err) {
    res.status(500).json({ message: "Error fetching trainers", error: err.message });
  }
});

// Get trainer Detaila
app.get("/user/:trainerId", authMiddleware, async (req, res) => {
  try {
    const trainer = await UsersModel.findById(req.params.trainerId).select("-password");
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    if (trainer.userType !== "trainer") {
      return res.status(403).json({ message: "This user is not a trainer" });
    }
    res.status(200).json({ user: trainer });
  } catch (err) {
    res.status(500).json({ message: "Error fetching trainer data", error: err.message });
  }
});

// Get info of service for the trainer
app.get("/user/services/:trainerId", authMiddleware, async (req, res) => {
  try {
    const trainer = await UsersModel.findById(req.params.trainerId);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    const trainerServices = trainer.services.filter(s => s.type === "trainer");
    if (trainerServices.length === 0) {
      return res.status(404).json({ message: "Trainer service not found" });
    }
    const service = trainerServices[0];
    res.status(200).json({ service });
  } catch (err) {
    res.status(500).json({ message: "Error fetching trainer service", error: err.message });
  }
});

// update user info
app.put("/user/update", authMiddleware, async (req, res) => {
  const { name, username, email, currentPassword, newPassword } = req.body;
  try {
    if (!name || !username || !email) {
      return res.status(400).json({ message: "Name, username, and email are required" });
    }
    const existingUser = await UsersModel.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: req.user.userId },
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name;
    user.username = username;
    user.email = email;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change password" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user: { name, username, email, userType: user.userType } });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
});

// Get All Products
app.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// Get Single Product
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

// Get Dogs Food
app.get("/dogs-food", async (req, res) => {
  try {
    const products = await ProductModel.find({ category: "dogs-food" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching dogs food", error: err.message });
  }
});

// Get Cats Food
app.get("/cats-food", async (req, res) => {
  try {
    const products = await ProductModel.find({ category: "cats-food" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cats food", error: err.message });
  }
});

// Get Accessories
app.get("/accessories", async (req, res) => {
  try {
    const products = await ProductModel.find({ category: "accessories" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching accessories", error: err.message });
  }
});

// إAdd Product
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

// Add travel Requirements
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

// Get travel requirements
app.get("/travel-requirements", async (req, res) => {
  try {
    const requirements = await TravelRequirementModel.find();
    res.json(requirements);
  } catch (err) {
    res.status(500).json({ message: "Error fetching travel requirements", error: err.message });
  }
});

// Add Product to cart
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
    const existingItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);
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

// Get Cart
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

// Remove Product from Cart
app.delete("/cart/remove/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params;
  try {
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();
    await user.populate("cart.productId");
    res.json({ message: "Product removed from cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart", error: err.message });
  }
});

// Add Post
app.post("/community/posts", authMiddleware, uploadPosts.single("image"), async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let imageUrl = null;
    if (req.file) {
      const filePath = req.file.path;
      const fileName = Date.now() + "-" + req.file.originalname;
      const client = new ftp();
      const uploadImageToFtp = () =>
        new Promise((resolve, reject) => {
          client.on("ready", () => {
            client.mkdir("/domains/express-elmadina.com/public_html/Pets_images", true, (mkdirErr) => {
              if (mkdirErr) {
                client.end();
                return reject(mkdirErr);
              }
              client.put(filePath, `/domains/express-elmadina.com/public_html/Pets_images/${fileName}`, (putErr) => {
                client.end();
                if (putErr) return reject(putErr);
                const finalUrl = `https://express-elmadina.com/Pets_images/${fileName}`;
                resolve(finalUrl);
              });
            });
          });
          client.on("error", (err) => reject(err));
          client.connect({
            host: "92.113.18.144",
            user: "u993113834",
            password: "Mahxoud@000",
          });
        });
      imageUrl = await uploadImageToFtp();
    }
    const newPost = new PostModel({
      content,
      author: req.user.userId,
      username: user.username,
      imageUrl,
      likes: [],
      comments: [],
    });
    await newPost.save();
    res.status(201).json({ message: "Post added successfully", post: newPost });
  } catch (err) {
    console.error("Error adding post:", err);
    res.status(500).json({ message: "Error adding post", error: err.message });
  }
});

// Get All Posts
app.get("/community/posts", async (req, res) => {
  try {
    const posts = await PostModel.find().populate("author", "username").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
});

// Add Or Delete Like From Post
app.post("/community/posts/:postId/like", authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const userId = req.user.userId;
    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ message: alreadyLiked ? "Like removed" : "Like added", post });
  } catch (err) {
    res.status(500).json({ message: "Error toggling like", error: err.message });
  }
});

// Add Comment On Post
app.post("/community/posts/:postId/comment", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newComment = { userId: req.user.userId, username: user.username, content };
    post.comments.push(newComment);
    await post.save();
    res.status(201).json({ message: "Comment added successfully", post });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
});

// -------------------------------------------------------------------------------------------

const axios =  require("axios");

let aiRes =[]
app.post("/pets", authMiddleware, uploadPets.array("images", 5),  async (req, res) => {
  try {
    const {
      petName,
      age,
      breed,
      type,
      healthStatus,
      vaccinations,
      notes,
      ownerName,
      ownerLocation,
      ownerPhoneNumber
    } = req.body;
    if (!petName || !age || !breed || !type || !healthStatus || !vaccinations || !ownerName || !ownerLocation || !ownerPhoneNumber || req.files.length === 0)
      return res.status(400).json({ message: "All fields are required" });
    
    for( const file of req.files) {
    const image = fs.readFileSync(file.path, {encoding: "base64"});
    axios({
        method: "POST",
        url: "https://serverless.roboflow.com/dog-and-cat-face-detector/1",
        params: {api_key: "dS3RZmgNp1oZ62SCy7cJ"},
        data: image,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    })
    .then(function(response) {
      aiRes = response.data.predictions;
    })
    .catch(function(error) {
        console.log(error.message);
    });
    }
    if (aiRes.length === 0) {
      return res.status(400).json({ message: "No pets detected in the images", aiRes, fileCount: req.files });
    }
    let imagePaths = [];
    for (let i=0; i<req.files.length; i++) {
      fileName = req.files[i].originalname;
      const remotePath = `/domains/express-elmadina.com/public_html/Pets_images/Pets/${fileName}`;
      await uploadToFTP(req.files[i].path,remotePath);
      let url = `https://express-elmadina.com/Pets_images/Pets/${fileName}`
      imagePaths.push(url)
    }
    const pet = new PetModel({ 
      petName,
      age,
      breed,
      type,
      healthStatus,
      vaccinations,
      notes,
      images: imagePaths,
      owner: {
        name: ownerName,
        location: ownerLocation,
        phoneNumber: ownerPhoneNumber
      }
    });

    await pet.save();
    res.status(201).json({ message: "Pet added successfully", pet, aiRes, fileCount: req.files });

  } catch (err) {
    res.status(500).json({ message: "Error adding pet", error: err.message });
  }
});

const ftpOptions = {
  host: process.env.FTP_HOST || '92.113.18.144',
  user: process.env.FTP_USER || 'u993113834',
  password: process.env.FTP_PASSWORD || 'Mahxoud@000',
};


// Helper function to upload file to FTP
const uploadToFTP = (localPath, remotePath) => {
  return new Promise((resolve, reject) => {
    const client = new ftp();
    
    client.on('ready', () => {
      console.log('FTP Connection Successful');
      
      client.put(localPath, remotePath, (err) => {
        client.end();
        if (err) {
          console.error('FTP Upload Error:', err);
          reject(err);
        } else {
          console.log('File uploaded successfully to FTP:', remotePath);
          resolve();
        }
      });
    });

    client.on('error', (err) => {
      console.error('FTP Connection Error:', err);
      reject(err);
    });

    client.connect(ftpOptions);
  });
};


app.get("/pets", async (req,res) => {
  try {
    const pets = await PetModel.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pets", error: err.message });
  }
});

app.get("/pet/:id", async (req, res) => {
  try {
    const pet = await PetModel.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pet", error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});