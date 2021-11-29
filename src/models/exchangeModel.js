import mongoose from "mongoose"

const schema = mongoose.Schema

const exchangeModel = new schema({
    name: {
        unique: true,
        type: String,
        required: "enter name!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default exchangeModel