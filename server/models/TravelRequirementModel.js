const mongoose = require("mongoose");

const TravelRequirementSchema = new mongoose.Schema({
  country: { type: String, required: true },
  documentsRequired: { type: [String], required: true },
  vaccinationsRequired: { type: [String], required: true },
  comfortTips: { type: [String], required: true },
  type: { type: String, required: true, enum: ["Dog", "Cat"] },
});

const TravelRequirementModel = mongoose.model("TravelRequirement", TravelRequirementSchema);

module.exports = TravelRequirementModel;
