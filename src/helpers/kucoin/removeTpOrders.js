import orderController from "../../controllers/orderController"
import signalController from "../../controllers/signalController"
import kucoinController from "../../controllers/kucoinController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"

function removeTpOrders({isFutures, stopOrder, userExchange})
{
    const {signal_id, entry_fill_index, price} = stopOrder
    const {user_id} = userExchange

    signalController.getSignalById({signal_id})
        .then(signal =>
        {
            const {title, pair, entries} = signal

            orderController.findOrders({query: {user_id, type: "tp", entry_fill_index, signal_id}})
                .then(orders =>
                {
                    orders.forEach(order =>
                    {
                        if (isFutures) kucoinController.cancelFutureOrder({userExchange, exchange_order_id: order.exchange_order_id})
                        else kucoinController.cancelSpotOrder({isStop: true, userExchange, exchange_order_id: order.exchange_order_id})
                    })
                })

            orderController.findOrders({query: {user_id, type: "entry", status: "open", signal_id}})
                .then(orders =>
                {
                    orders.forEach(order =>
                    {
                        if (isFutures) kucoinController.cancelFutureOrder({userExchange, exchange_order_id: order.exchange_order_id})
                        else kucoinController.cancelSpotOrder({isStop: true, userExchange, exchange_order_id: order.exchange_order_id})
                    })
                })

            orderController.findOrders({query: {user_id, type: "stop", signal_id}})
                .then(orders =>
                {
                    const lastStopIndex = orders.reduce((sum, item) => item.entry_fill_index > sum ? item.entry_fill_index : sum, 0)
                    if (lastStopIndex === entry_fill_index)
                    {
                        sendTelegramNotificationByUserExchange({
                            userExchange,
                            title,
                            text: telegramConstant.stopSignalAndTpOrdersRemoved({
                                isFutures,
                                pair,
                                lossInPercent: (1 - (price / entries[entry_fill_index].price)) * 100,
                            }),
                        })
                    }
                })
        })
}

export default removeTpOrders