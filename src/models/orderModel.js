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
    lot: {
        type: Number,
        required: "enter lot!",
    },
    symbol: {
        type: String,
        required: "enter symbol!",
    },
    type: {
        type: String,
        enum: ["stop", "tp", "entry"],
        required: "Enter type!",
    },
    entry_or_tp_index: {
        type: Number,
        required: [
            function ()
            {
                this.type === "tp" || this.type === "entry"
            },
            "entry_or_tp_index is required if type is tp or entry",
        ],
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
    filled_date: {
        type: Date,
    },
})

export default orderModel