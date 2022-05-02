import mongoose from "mongoose"

const schema = mongoose.Schema

const signalModel = new schema({
    text: {
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
    entries: {
        type: Array,
        required: "enter entries!",
    },
    targets: {
        type: Array,
        required: "enter targets!",
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
    risk: {
        type: Number,
        required: "enter risk!",
    },
    leverage: {
        type: Number,
        required: "leverage is required if is_futures is specified",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default signalModel