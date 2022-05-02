import signalController from "../../controllers/signalController"
import orderController from "../../controllers/orderController"
import kucoinController from "../../controllers/kucoinController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"

function updateSpotStopOrder({tpOrder, userExchange})
{
    const {signal_id, entry_fill_index, entry_or_tp_index} = tpOrder
    const {user_id} = userExchange

    signalController.getSignalById({signal_id})
        .then(signal =>
        {
            const {targets, entries} = signal
            orderController.findOrders({query: {user_id, entry_fill_index: entry_fill_index, signal_id}})
                .then(orders =>
                {
                    const stopOrders = orders.filter(order => order.type === "stop")
                    const stopOrder = stopOrders[stopOrders.length - 1]
                    kucoinController.cancelSpotOrder({isStop: true, userExchange, exchange_order_id: stopOrder.exchange_order_id})

                    const tpOrders = orders.filter(order => order.type === "tp")
                    if (entry_or_tp_index < targets.length - 1)
                    {
                        orderController.addOrder({
                            user_exchange_id: stopOrder.user_exchange_id,
                            signal_id: stopOrder.signal_id,
                            price: entries[stopOrder.entry_fill_index].price,
                            size: tpOrders.reduce((sum, order) => sum + (order.entry_or_tp_index > entry_or_tp_index ? order.size : 0), 0),
                            symbol: stopOrder.symbol,
                            type: stopOrder.type,
                            entry_fill_index: stopOrder.entry_fill_index,
                            status: stopOrder.status,
                        })
                            .then(order =>
                            {
                                kucoinController.createSpotOrder({
                                    userExchange,
                                    order: {
                                        type: "market",
                                        clientOid: order._id,
                                        side: "sell",
                                        symbol: order.symbol,
                                        size: order.size,
                                        stop: "loss",
                                        stopPrice: order.price,
                                    },
                                })
                                    .then(() =>
                                    {
                                        sendTelegramNotificationByUserExchange({userExchange, text: telegramConstant.tpFilledAndStopUpdated({tpIndex: entry_or_tp_index + 1})})
                                    })
                                    .catch(() =>
                                    {
                                        sendTelegramNotificationByUserExchange({userExchange, text: telegramConstant.tpFilledAndStopFailed({tpIndex: entry_or_tp_index + 1})})
                                    })
                            })
                    }
                    else sendTelegramNotificationByUserExchange({userExchange, text: telegramConstant.tpFilledAndDone})

                })
        })
}

export default updateSpotStopOrder