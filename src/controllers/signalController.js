import mongoose from "mongoose"
import signalModel from "../models/signalModel"
import orderController from "./orderController"
import userExchangeController from "./userExchangeController"
import userExchangeConstant from "../constants/userExchangeConstant"
import kucoinController from "./kucoinController"

const signalTb = mongoose.model("signal", signalModel)

function addSignal(signal)
{
    return new signalTb(signal).save()
        .then(addedSignal =>
        {
            if (addedSignal.is_futures)
            {
                userExchangeController.getUserExchanges({is_futures: true, progress_level: userExchangeConstant.progress_level.complete})
                    .then(userExchanges =>
                    {
                        userExchanges.forEach(userExchange =>
                        {
                            kucoinController.getFutureAccountOverview({userExchange})
                                .then(res =>
                                {
                                    const {availableBalance} = res || {}
                                    const useForEachEntry = Math.floor(availableBalance / addedSignal.entry.length)
                                    addedSignal.entry.forEach((item, index) =>
                                    {
                                        orderController.addOrder({
                                            user_id: userExchange.user_id,
                                            signal_id: addedSignal._id,
                                            price: item,
                                            size: useForEachEntry,
                                            symbol: addedSignal.pair,
                                            is_entry: true,
                                            entry_or_tp_index: index,
                                            is_open: true,
                                        })
                                            .then(order =>
                                            {
                                                kucoinController.createFutureOrder({
                                                    userExchange,
                                                    order: {
                                                        clientOid: order._id,
                                                        side: addedSignal.is_short ? "sell" : "buy",
                                                        symbol: addedSignal.pair,
                                                        leverage: addedSignal.leverage,
                                                        stop: addedSignal.is_short ? "up" : "down",
                                                        stopPrice: addedSignal.stop,
                                                        price: item,
                                                        size: useForEachEntry,
                                                    },
                                                })
                                                    .then(res => console.log({res}))
                                                    .catch(err => console.error({error: err, err: err?.response?.data}))
                                            })
                                    })
                                })
                        })
                    })
            }
        })
}

const signalController = {
    addSignal,
}

export default signalController