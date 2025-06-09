const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
   petName: { type: String, required: true },
   age: { type: Number, required: true },
   breed: { type: String, required: true },
   type: { type: String, enum: ['Male', 'Female'], required: true },
   healthStatus: { type: String, required: true  },
   vaccinations: { type: String, required: true },
   notes: { type: String },
   images: [{ type: String, required: true }],

owner: {
   name: { type: String, required: true },
   location: { type: String, required: true },
   phoneNumber: { type: String, required: true },
}
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);
