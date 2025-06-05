const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  programName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String, // مثال: "4 weeks" أو "1 hour per session"
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ["EGP", "USD"],
    default: "EGP",
    required: true,
  },
});

const serviceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["clinic", "trainer"],
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },

  // حقول الـ clinic
  clinicName: {
    type: String,
    required: function () {
      return this.type === "clinic";
    },
  },
  doctorName: {
    type: String,
    required: function () {
      return this.type === "clinic";
    },
  },
  location: {
    type: String,
    required: function () {
      return this.type === "clinic";
    },
  },
  workingHours: {
    type: String,
    required: function () {
      return this.type === "clinic";
    },
  },
  servicePrice: {
    type: Number,
    required: function () {
      return this.type === "clinic";
    },
  },
  currency: {
    type: String,
    enum: ["EGP", "USD"],
    default: "EGP",
    required: function () {
      return this.type === "clinic";
    },
  },
  serviceType: {
    type: String,
    required: function () {
      return this.type === "clinic";
    },
  },
  doctorDescription: {
    type: String,
    required: function () {
      return this.type === "clinic";
    },
  },

  // حقول الـ trainer
  trainerName: {
    type: String,
    required: function () {
      return this.type === "trainer";
    },
  },
  specialty: {
    type: String,
    required: function () {
      return this.type === "trainer";
    },
  },
  location: {
    type: String,
    required: function () {
      return this.type === "trainer";
    },
  },
  workingHours: {
    type: String,
    required: function () {
      return this.type === "trainer";
    },
  },
  availablePrograms: {
    type: [programSchema], // مصفوفة من البرامج
    required: function () {
      return this.type === "trainer";
    },
    validate: {
      validator: function (array) {
        return this.type !== "trainer" || (array && array.length > 0);
      },
      message: "At least one program is required for trainers.",
    },
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;