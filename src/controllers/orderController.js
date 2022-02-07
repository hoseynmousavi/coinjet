import mongoose from "mongoose"
import orderModel from "../models/orderModel"

const orderTb = mongoose.model("order", orderModel)

function addOrder(order)
{
    return new orderTb(order).save()
}

function removeOrder({order_id})
{
    return orderTb.deleteOne({_id: order_id})
}

function updateOrder({query, update})
{
    return orderTb.updateOne(query, update)
}

const orderController = {
    addOrder,
    removeOrder,
    updateOrder,
}

export default orderController