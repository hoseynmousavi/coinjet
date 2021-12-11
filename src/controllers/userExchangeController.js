import mongoose from "mongoose"
import userExchangeModel from "../models/userExchangeModel"

const userExchangeTb = mongoose.model("user-exchange", userExchangeModel)

function getUserExchanges({query, projection, options})
{
    return userExchangeTb.find(query, projection, options)
}

const userExchangeController = {
    getUserExchanges,
}

export default userExchangeController