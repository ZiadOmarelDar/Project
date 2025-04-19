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
    // حقول خاصة بالـ clinicAdmin
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
    // حقول خاصة بالـ trainer
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
    availablePrograms: {
      type: String,
      required: function () {
        return this.type === "trainer";
      },
    },
  });
  
  const Service = mongoose.model("Service", serviceSchema);