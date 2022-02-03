import mongoose from "mongoose"

const schema = mongoose.Schema

const orderModel = new schema({
    user_id: {
        index: true,
        type: schema.Types.ObjectId,
        required: "enter user_id!",
    },
    signal_id: {
        index: true,
        type: schema.Types.ObjectId,
        required: "enter signal_id!",
    },
    price: {
        type: Number,
        required: "enter price!",
    },
    size: {
        type: Number,
        required: "enter size!",
    },
    symbol: {
        type: String,
        required: "enter symbol!",
    },
    is_entry: { // not TP
        type: Boolean,
        required: "enter is_entry!",
    },
    entry_or_tp_index: {
        type: Number,
        required: "enter entry_or_tp_index!",
    },
    is_open: {
        index: true,
        type: Boolean,
        required: "enter is_open!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default orderModel