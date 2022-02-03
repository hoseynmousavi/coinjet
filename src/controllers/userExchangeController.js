import mongoose from "mongoose"
import userExchangeModel from "../models/userExchangeModel"

const userExchangeTb = mongoose.model("user-exchange", userExchangeModel)

function getUserExchanges({is_futures, progress_level})
{
    return userExchangeTb.find({is_futures, progress_level})
}

function addUserExchange(userExchange)
{
    return new userExchangeTb(userExchange).save()
}

function getUserExchangesByUserId({user_id, progress_level})
{
    return userExchangeTb.find({user_id, ...(progress_level ? {progress_level} : {})})
}

function updateUserExchange({userExchangeId, update})
{
    return userExchangeTb.updateOne({_id: userExchangeId}, update)
}

function removeUserExchangeByUserExchangeIdAndUserId({userExchangeId, user_id})
{
    return userExchangeTb.deleteOne({_id: userExchangeId, user_id})
}

function removeUserExchangeByProgressLevel({progress_level, user_id})
{
    return userExchangeTb.deleteOne({progress_level, user_id})
}

const userExchangeController = {
    getUserExchanges,
    addUserExchange,
    getUserExchangesByUserId,
    updateUserExchange,
    removeUserExchangeByUserExchangeIdAndUserId,
    removeUserExchangeByProgressLevel,
}

export default userExchangeController