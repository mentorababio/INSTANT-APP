const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: false,
    },
    email: {
        type : String,
        required: [true, "email is required"],
        unique: [true, "email already exists"],
        trim: true,
        minLength: [5, "email must be at least 5 characters"],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [6, "password must be at least 6 characters"],
        trim: true,
        select: false, 
    },
    phone: {
        type: Number,
        required: [true, "phone number is required"],
    },
    walletBallance: {
        type: Number,
        default: 0,
    },
    notifications: {
        type: Boolean, 
        default: true,
    }, 
    timestamps: true}
);

    Module.exports = mongoose.Model('user', userSchema);