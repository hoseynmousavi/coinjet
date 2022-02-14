import mongoose from "mongoose"

const schema = mongoose.Schema

const userModel = new schema({
    telegram_id: {
        unique: true,
        index: true,
        type: Number,
        required: "enter telegram_id!",
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    username: {
        unique: true,
        type: String,
    },
    telegram_username: {
        type: String,
    },
    telegram_chat_id: {
        unique: true,
        type: String,
        required: "enter telegram_chat_id!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default userModel