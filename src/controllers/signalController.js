import mongoose from "mongoose"
import signalModel from "../models/signalModel"
import orderController from "./orderController"
import userExchangeController from "./userExchangeController"
import userExchangeConstant from "../constants/userExchangeConstant"
import kucoinController from "./kucoinController"
import pairToFuturesSymbol from "../helpers/kucoin/pairToFuturesSymbol"

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
                                .then(overview =>
                                {
                                    const {availableBalance} = overview || {}
                                    const usdtBalance = Math.floor(availableBalance * 1 / addedSignal.entry.length) // TODO change it
                                    kucoinController.getFuturesActiveContracts()
                                        .then(contracts =>
                                        {
                                            const symbol = pairToFuturesSymbol({pair: addedSignal.pair})
                                            const contract = contracts.filter(item => item.symbol === symbol)?.[0]
                                            const enoughUsdtAndContract = addedSignal.entry.every(price => contract && usdtBalance / price >= contract.multiplier)
                                            if (enoughUsdtAndContract)
                                            {
                                                addedSignal.entry.forEach((price, index) =>
                                                {
                                                    const size = Math.floor((usdtBalance / price) / contract.multiplier)
                                                    orderController.addOrder({
                                                        user_id: userExchange.user_id,
                                                        signal_id: addedSignal._id,
                                                        price,
                                                        size,
                                                        lot: contract.multiplier,
                                                        symbol,
                                                        type: "entry",
                                                        entry_or_tp_index: index,
                                                        status: "open",
                                                    })
                                                        .then(order =>
                                                        {
                                                            kucoinController.createFutureOrder({
                                                                userExchange,
                                                                order: {
                                                                    type: "limit",
                                                                    clientOid: order._id,
                                                                    side: addedSignal.is_short ? "sell" : "buy",
                                                                    symbol: order.symbol,
                                                                    leverage: addedSignal.leverage,
                                                                    price: order.price,
                                                                    size: order.size,
                                                                },
                                                            })
                                                                .then(res =>
                                                                {
                                                                    console.log(res?.data?.orderId)
                                                                    if (res?.data?.orderId)
                                                                    {
                                                                        orderController.updateOrder({query: {_id: order._id}, update: {exchange_order_id: res.data.orderId}})
                                                                    }
                                                                    else
                                                                    {
                                                                        orderController.removeOrder({order_id: order._id})
                                                                    }
                                                                })
                                                                .catch(err =>
                                                                {
                                                                    console.error({err: err?.response?.data})
                                                                    orderController.removeOrder({order_id: order._id})
                                                                })
                                                        })
                                                })
                                            }
                                        })
                                })
                        })
                    })
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