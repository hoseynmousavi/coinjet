import mongoose from "mongoose"
import signalModel from "../models/signalModel"
import createFuturesEntryOrders from "../helpers/kucoin/createFuturesEntryOrders"
import createSpotEntryOrders from "../helpers/kucoin/createSpotEntryOrders"
import userExchangeController from "./userExchangeController"
import userExchangeConstant from "../constants/userExchangeConstant"

const signalTb = mongoose.model("signal", signalModel)

function addSignal(signal)
{
    return new signalTb(signal).save()
        .then(addedSignal =>
        {
            userExchangeController.getUserExchanges({is_futures: addedSignal.is_futures, progress_level: userExchangeConstant.progress_level.complete})
                .then(userExchanges =>
                {
                    if (addedSignal.is_futures)
                    {
                        createFuturesEntryOrders({userExchanges, signal: addedSignal})
                    }
                    else
                    {
                        createSpotEntryOrders({userExchanges, signal: addedSignal})
                    }
                })
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