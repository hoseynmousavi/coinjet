import mongoose from "mongoose"
import signalModel from "../models/signalModel"
import createFuturesEntryOrders from "../helpers/kucoin/createFuturesEntryOrders"
import createSpotEntryOrders from "../helpers/kucoin/createSpotEntryOrders"

const signalTb = mongoose.model("signal", signalModel)

function addSignal(signal)
{
    return new signalTb(signal).save()
        .then(addedSignal =>
        {
            if (addedSignal.is_futures)
            {
                createFuturesEntryOrders({signal: addedSignal})
            }
            else
            {
                createSpotEntryOrders({signal: addedSignal})
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