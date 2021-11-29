import mongoose from "mongoose"

const schema = mongoose.Schema

const userExchangeModel = new schema({
    user_id: {
        index: true,
        type: schema.Types.ObjectId,
        required: "enter user_id!",
    },
    exchange_id: {
        index: true,
        type: schema.Types.ObjectId,
        required: "enter exchange_id!",
    },
    name: {
        type: String,
    },
    user_key: {
        type: String,
    },
    user_passphrase: {
        type: String,
    },
    user_secret: {
        type: String,
    },
    progress_level: {
        type: String,
        enum: ["complete", "in-progress"],
        required: "Enter progress_level!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default userExchangeModel