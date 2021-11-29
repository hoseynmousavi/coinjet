import mongoose from "mongoose"
import userExchangeModel from "../models/userExchangeModel"

const userExchangeTb = mongoose.model("user-exchange", userExchangeModel)

function addUserExchange(userExchange)
{
    return new userExchangeTb(userExchange).save()
}

function getUserExchangesByUserIdAndExchangeId({user_id, exchange_id, progress_level})
{
    return new userExchangeTb.find({user_id, exchange_id, progress_level})
}

const userExchangeController = {
    addUserExchange,
    getUserExchangesByUserIdAndExchangeId,
}

export default userExchangeController