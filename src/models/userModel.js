import mongoose from "mongoose"
import regexConstant from "../constants/regexConstant"

const schema = mongoose.Schema

const userModel = new schema({
    full_name: {
        type: String,
        trim: true,
        required: "enter full_name!",
    },
    email: {
        type: String,
        unique: true,
        index: true,
        lowercase: true,
        validate: regexConstant.EMAIL_REGEX,
        required: "enter email!",
    },
    email_verified: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        minlength: 11,
        maxlength: 11,
        index: true,
    },
    phone_verified: {
        type: Boolean,
        default: true,
    },
    password: {
        type: String,
        index: true,
        minlength: 6,
        maxlength: 32,
        required: "enter password!",
    },
    avatar_url: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    telegram_username: {
        type: String,
        unique: true,
        sparse: true,
    },
    telegram_chat_id: {
        type: String,
        index: true,
        unique: true,
        sparse: true,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default userModel