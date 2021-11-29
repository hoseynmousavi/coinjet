import mongoose from "mongoose"

const schema = mongoose.Schema

const userModel = new schema({
    telegram_id: {
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
        type: String,
        required: "enter username!",
    },
    telegram_username: {
        type: String,
        required: "enter telegram_username!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default userModel