import mongoose from "mongoose"

const schema = mongoose.Schema

const signalModel = new schema({
    message: {
        type: String,
        required: "enter text!",
    },
    telegram_chat_id: {
        type: Number,
        required: "enter telegram_chat_id!",
    },
    title: {
        type: String,
        required: "enter title!",
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
    is_futures: {
        type: Boolean,
        required: "enter is_futures!",
    },
    is_short: {
        type: Boolean,
        required: [
            function ()
            {
                this.is_futures
            },
            "is_short is required if is_futures is specified",
        ],
    },
    leverage: {
        type: Number,
        required: [
            function ()
            {
                this.is_futures
            },
            "leverage is required if is_futures is specified",
        ],
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default signalModel