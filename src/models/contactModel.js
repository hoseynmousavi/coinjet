import mongoose from "mongoose"

const schema = mongoose.Schema

const contactModel = new schema({
    subject: {
        type: String,
        enum: ["order_simple_company", "order_advance_company", "order_simple_sale", "order_advance_sale", "custom_package", "bug_report", "comment", "collaboration", "other"],
        required: "enter subject!",
    },
    description: {
        type: String,
        required: "enter description!",
    },
    contact_info: {
        type: String,
        required: "enter contact_info!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default contactModel