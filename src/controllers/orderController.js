import mongoose from "mongoose"
import orderModel from "../models/orderModel"

const orderTb = mongoose.model("order", orderModel)

function addOrder(order)
{
    return new orderTb(order).save()
}

const orderController = {
    addOrder,
}

export default orderController