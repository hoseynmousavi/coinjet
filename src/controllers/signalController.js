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
                                    const useForEachEntry = Math.floor(availableBalance * 0.1 / addedSignal.leverage / addedSignal.entry.length)
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
                                                        pair: addedSignal.pair,
                                                        leverage: addedSignal.leverage,
                                                        price: item,
                                                        size: useForEachEntry,
                                                    },
                                                })
                                                    .then(res => console.log({res}))
                                                    .catch(err =>
                                                    {
                                                        console.error({err: err?.response?.data})
                                                        orderController.removeOrder({order_id: order._id})
                                                            .then(yes => console.log(yes))
                                                            .catch(fuck => console.log(fuck))
                                                    })
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