import mongoose from "mongoose"

const schema = mongoose.Schema

const signalModel = new schema({
    message: {
        type: String,
        required: "enter text!",
    },
    pair: {
        type: String,
        required: "enter pair!",
    },
    stop: {
        type: Number,
        required: "enter stop!",
    },
    entry: {
        type: Array,
        required: "enter entry!",
    },
    target: {
        type: Array,
        required: "enter target!",
    },
    is_future: {
        type: Boolean,
        required: "enter is_future!",
    },
    is_short: {
        type: Boolean,
        required: [
            function ()
            {
                this.is_future
            },
            "is_short is required if is_future is specified",
        ],
    },
    leverage: {
        type: Number,
        required: [
            function ()
            {
                this.is_future
            },
            "leverage is required if is_future is specified",
        ],
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default signalModel