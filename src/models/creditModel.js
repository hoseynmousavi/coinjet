import mongoose from "mongoose"

const schema = mongoose.Schema

const creditModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "enter user_id!",
    },
    price: {
        type: Number,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
    expire_date: {
        type: Date,
        required: "enter expire_date!",
    },
})

export default creditModel