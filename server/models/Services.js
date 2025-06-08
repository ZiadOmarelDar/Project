const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  programName: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, enum: ["EGP", "USD"], default: "EGP", required: true },
});

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
  type: { type: String, enum: ["clinic", "trainer"], required: true },
  contactInfo: { type: String, required: true },
  // حقول الـ clinic
  clinicName: { type: String, required: function () { return this.type === "clinic"; } },
  doctorName: { type: String, required: function () { return this.type === "clinic"; } },
  location: {
    governorate: {
      type: String,
      enum: [
        "Cairo", "Giza", "Alexandria", "Luxor", "Aswan", "Asyut", "Beheira", "Beni Suef", "Dakahlia", "Damietta",
        "Faiyum", "Gharbia", "Ismailia", "Kafr El Sheikh", "Matrouh", "Minya", "Monufia", "New Valley", "North Sinai",
        "Port Said", "Qalyubia", "Qena", "Red Sea", "Sharqia", "Sohag", "South Sinai", "Suez"
      ],
      required: function () { return this.type === "clinic"; },
    },
    specificLocation: { type: String, required: function () { return this.type === "clinic"; } },
  },
  workingHours: { type: String, required: function () { return this.type === "clinic"; } },
  servicePrice: { type: Number, required: function () { return this.type === "clinic"; } },
  currency: { type: String, enum: ["EGP", "USD"], default: "EGP", required: function () { return this.type === "clinic"; } },
  serviceType: { type: String, required: function () { return this.type === "clinic"; } },
  doctorDescription: { type: String, required: function () { return this.type === "clinic"; } },
  specialties: {
    type: [String],
    enum: clinicSpecialties,
    required: function () { return this.type === "clinic"; },
    validate: {
      validator: function (array) { return this.type !== "clinic" || (array && array.length > 0); },
      message: "At least one specialty is required for clinics.",
    },
  },
  // حقول الـ trainer
  trainerName: { type: String, required: function () { return this.type === "trainer"; } },
  specialty: { type: String, required: function () { return this.type === "trainer"; } },
  location: { type: String, required: function () { return this.type === "trainer"; } },
  workingHours: { type: String, required: function () { return this.type === "trainer"; } },
  availablePrograms: {
    type: [programSchema],
    required: function () { return this.type === "trainer"; },
    validate: {
      validator: function (array) { return this.type !== "trainer" || (array && array.length > 0); },
      message: "At least one program is required for trainers.",
    },
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;