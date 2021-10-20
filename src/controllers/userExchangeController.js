import mongoose from "mongoose"
import userExchangeModel from "../models/userExchangeModel"

const userExchangeTb = mongoose.model("user-exchange", userExchangeModel)

function addUserExchange(userExchange)
{
    return new userExchangeTb(userExchange).save()
}

const userExchangeController = {
    addUserExchange,
}

export default userExchangeController