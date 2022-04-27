import mongoose from "mongoose"
import signalModel from "../models/signalModel"
import createFuturesEntryOrders from "../helpers/kucoin/createFuturesEntryOrders"
import createSpotEntryOrders from "../helpers/kucoin/createSpotEntryOrders"
import userExchangeController from "./userExchangeController"
import userExchangeConstant from "../constants/userExchangeConstant"
import userController from "./userController"

const signalTb = mongoose.model("signal", signalModel)

function addSignal({telegram_id, signal})
{
    return new signalTb(signal).save()
        .then(addedSignal =>
        {
            if (telegram_id)
            {
                userController.getUserByTelegramId({telegram_id})
                    .then(user =>
                    {
                        console.log({user})
                        submitEntryOrders({addedSignal, user})
                    })
            }
            else
            {
                submitEntryOrders({addedSignal})
            }
        })
}

function submitEntryOrders({addedSignal, user})
{
    userExchangeController.getUserExchanges({query: {...(user ? {user_id: user._id} : {}), is_futures: addedSignal.is_futures, progress_level: userExchangeConstant.progress_level.complete}})
        .then(userExchanges =>
        {
            console.log({userExchanges})
            if (addedSignal.is_futures)
            {
                createFuturesEntryOrders({userExchanges, signal: addedSignal})
            }
            else
            {
                createSpotEntryOrders({userExchanges, signal: addedSignal})
            }
        })
}

function getSignalById({signal_id})
{
    return signalTb.findOne({_id: signal_id})
}

const signalController = {
    addSignal,
    getSignalById,
}

export default signalController