import mongoose from "mongoose"
import orderModel from "../models/orderModel"

const orderTb = mongoose.model("order", orderModel)

function addOrder(order)
{
    return new orderTb(order).save().then()
}

function removeOrder({order_id})
{
    return orderTb.deleteOne({_id: order_id}).then()
}

function findOrders({query})
{
    return orderTb.find(query).then()
}

function updateOrder({query, update})
{
    return orderTb.findOneAndUpdate(query, update, {new: true}).then()
}

const orderController = {
    addOrder,
    removeOrder,
    findOrders,
    updateOrder,
}

export default orderController