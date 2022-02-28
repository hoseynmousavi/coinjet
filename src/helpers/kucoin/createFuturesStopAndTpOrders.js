import signalController from "../../controllers/signalController"
import orderController from "../../controllers/orderController"
import kucoinController from "../../controllers/kucoinController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"

function createFuturesStopAndTpOrders({entryOrder, userExchange})
{
    signalController.getSignalById({signal_id: entryOrder.signal_id})
        .then(signal =>
        {
            orderController.addOrder({
                user_exchange_id: userExchange._id,
                signal_id: entryOrder.signal_id,
                price: signal.stop,
                size: entryOrder.size,
                lot: entryOrder.lot,
                symbol: entryOrder.symbol,
                type: "stop",
                entry_fill_index: entryOrder.entry_or_tp_index,
                status: "open",
            })
                .then(order =>
                {
                    kucoinController.createFutureOrder({
                        userExchange,
                        order: {
                            type: "market",
                            clientOid: order._id,
                            side: signal.is_short ? "buy" : "sell",
                            symbol: order.symbol,
                            leverage: 1,
                            size: order.size,
                            stop: signal.is_short ? "up" : "down",
                            stopPrice: order.price,
                        },
                    })
                })

            let remainedSize = entryOrder.size
            let tpCount = 0
            signal.target.forEach((price, index) =>
            {
                if (index < signal.target.length - 1 || remainedSize)
                {
                    tpCount++
                    const size = index === signal.target.length - 1 ? remainedSize : Math[entryOrder.size <= signal.target.length ? "ceil" : "floor"](entryOrder.size / signal.target.length)
                    remainedSize -= size
                    orderController.addOrder({
                        user_exchange_id: userExchange._id,
                        signal_id: entryOrder.signal_id,
                        price,
                        size,
                        lot: entryOrder.lot,
                        symbol: entryOrder.symbol,
                        type: "tp",
                        entry_fill_index: entryOrder.entry_or_tp_index,
                        entry_or_tp_index: index,
                        status: "open",
                    })
                        .then(order =>
                        {
                            kucoinController.createFutureOrder({
                                userExchange,
                                order: {
                                    type: "market",
                                    clientOid: order._id,
                                    side: signal.is_short ? "buy" : "sell",
                                    symbol: order.symbol,
                                    leverage: 1,
                                    size: order.size,
                                    stop: signal.is_short ? "down" : "up",
                                    stopPrice: price,
                                },
                            })
                        })
                }
            })

            sendTelegramNotificationByUserExchange({
                userExchange,
                text: telegramConstant.entryOrderFilledAndOrdersAdded({tpCount, entryIndex: entryOrder.entry_or_tp_index + 1}),
            })
        })
}

export default createFuturesStopAndTpOrders