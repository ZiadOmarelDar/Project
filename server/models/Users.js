const mongoose = require("mongoose");

const clinicSpecialties = [
  "Basic Medical Services",
  "Vaccinations",
  "Preventive Care",
  "Diagnostic Services",
  "Surgical Procedures",
  "Dental Care",
  "Grooming and Hygiene",
  "Boarding Services"
];

const serviceSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["clinic", "trainer"] },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  // بيانات الـ trainer
  trainerName: { type: String },
  specialty: { type: String, enum: ["Obedience Training", "Agility Training", "Behavioral Correction", "Puppy Training", "Trick Training"] },
  availablePrograms: [{ type: String, enum: ["Private Sessions", "Online Training"] }],
  // بيانات الـ clinic
  clinicName: { type: String },
  doctorName: { type: String },
  location: {
    governorate: {
      type: String,
      enum: [
        "Cairo", "Giza", "Alexandria", "Luxor", "Aswan", "Asyut", "Beheira", "Beni Suef", "Dakahlia", "Damietta",
        "Faiyum", "Gharbia", "Ismailia", "Kafr El Sheikh", "Matrouh", "Minya", "Monufia", "New Valley", "North Sinai",
        "Port Said", "Qalyubia", "Qena", "Red Sea", "Sharqia", "Sohag", "South Sinai", "Suez"
      ],
    },
    specificLocation: { type: String },
  },
  workingHours: { type: String },
  servicePrice: { type: Number },
  currency: { type: String, enum: ["EGP", "USD"] },
  serviceType: { type: String },
  doctorDescription: { type: String },
  clinicPhotos: [{ type: String }],
  specialties: {
    type: [String],
    enum: clinicSpecialties,
  },
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userType: { type: String, required: true, enum: ["user", "clinicAdmin", "trainer"] },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userPhoto: { type: String, default: "not found" },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  services: [serviceSchema],
});

module.exports = mongoose.model("User", userSchema);