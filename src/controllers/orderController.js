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
        .then(ok => console.log({ok}))
        .catch(err =>
        {
            console.log({err})
            throw err
        })
}

function updateOrder({query, update})
{
    return orderTb.findOneAndUpdate(query, update, {new: true})
}

const orderController = {
    addOrder,
    removeOrder,
    updateOrder,
}

export default orderController