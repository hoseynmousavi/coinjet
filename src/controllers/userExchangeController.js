import mongoose from "mongoose"
import userExchangeModel from "../models/userExchangeModel"

const userExchangeTb = mongoose.model("user-exchange", userExchangeModel)

function addUserExchange(userExchange)
{
    return new userExchangeTb(userExchange).save()
}

function getUserExchangesByUserIdAndExchangeId({user_id, exchange_id, progress_level})
{
    return userExchangeTb.find({user_id, exchange_id, progress_level})
}

function updateUserExchange({userExchangeId, update})
{
    return userExchangeTb.updateOne({_id: userExchangeId}, update)
}

const userExchangeController = {
    addUserExchange,
    getUserExchangesByUserIdAndExchangeId,
    updateUserExchange,
}

export default userExchangeController