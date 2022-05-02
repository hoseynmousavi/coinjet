import orderController from "../../controllers/orderController"
import signalController from "../../controllers/signalController"
import kucoinController from "../../controllers/kucoinController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"

function removeTpOrders({isFutures, stopOrder, userExchange})
{
    const {signal_id, entry_fill_index} = stopOrder
    const {user_id} = userExchange

    signalController.getSignalById({signal_id})
        .then(() =>
        {
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

            sendTelegramNotificationByUserExchange({userExchange, text: telegramConstant.stopSignalAndTpOrdersRemoved})
        })
}

export default removeTpOrders