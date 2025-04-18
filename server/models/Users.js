const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
    },
    userType: {
        type: String,
        enum: {
            values: ["user", "clinicAdmin", "trainer"],
            message: "{VALUE} is not a valid user type",
        },
        default: "user",
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity must be at least 1"],
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

UsersSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const UsersModel = mongoose.model("users", UsersSchema);

module.exports = UsersModel;






