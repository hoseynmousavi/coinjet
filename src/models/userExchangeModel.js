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
        required: "enter name!",
    },
    user_key: {
        type: String,
        required: "enter user_key!",
    },
    user_passphrase: {
        type: String,
        required: "enter user_passphrase!",
    },
    user_secret: {
        type: String,
        required: "enter user_secret!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

userExchangeModel.index({user_id: 1, name: 1}, {unique: true})

export default userExchangeModel