import mongoose from "mongoose"
import signalModel from "../models/signalModel"
import createFuturesEntryOrders from "../helpers/kucoin/createFuturesEntryOrders"
import createSpotEntryOrders from "../helpers/kucoin/createSpotEntryOrders"
import userExchangeController from "./userExchangeController"
import userExchangeConstant from "../constants/userExchangeConstant"
import userController from "./userController"

const signalTb = mongoose.model("signal", signalModel)

function addSignal({telegram_id, signal: {text, telegram_chat_id, title, pair, is_futures, is_short, risk, entries, targets, stop}})
{
    const stopLossPercent = Math.floor(1 / (Math.abs(entries[0].price - stop) / entries[0].price))
    let leverage = Math.min(20, Math.max(1, stopLossPercent - 3))
    const use_balance_percent = stopLossPercent * risk
    new signalTb({text, telegram_chat_id, title, pair, is_futures, is_short, risk, entries, targets, stop, leverage, use_balance_percent}).save()
        .then(addedSignal =>
        {
            if (telegram_id)
            {
                userController.getUserByTelegramId({telegram_id})
                    .then(user =>
                    {
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
            if (addedSignal.is_futures)
            {
                createFuturesEntryOrders({isBroadcast: !user, userExchanges, signal: addedSignal})
            }
            else
            {
                createSpotEntryOrders({isBroadcast: !user, userExchanges, signal: addedSignal})
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