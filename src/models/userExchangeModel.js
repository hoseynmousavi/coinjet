import mongoose from "mongoose"
import userExchangeConstant from "../constants/userExchangeConstant"

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
    is_futures: {
        type: Boolean,
        required: "enter is_futures!",
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
        enum: [userExchangeConstant.progress_level.inProgress, userExchangeConstant.progress_level.complete],
        required: "Enter progress_level!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

userExchangeModel.index({user_key: 1, user_passphrase: 1, user_secret: 1}, {unique: true})

export default userExchangeModel