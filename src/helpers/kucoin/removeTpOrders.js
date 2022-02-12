import orderController from "../../controllers/orderController"
import signalController from "../../controllers/signalController"
import kucoinController from "../../controllers/kucoinController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"

function removeTpOrders({isFutures, stopOrder, userExchange})
{
    signalController.getSignalById({signal_id: stopOrder.signal_id})
        .then(signal =>
        {
            orderController.findOrders({query: {user_id: userExchange.user_id, type: "tp", entry_fill_index: stopOrder.entry_fill_index, signal_id: signal._id}})
                .then(orders =>
                {
                    orders.forEach(order =>
                    {
                        if (isFutures) kucoinController.cancelFutureOrder({userExchange, exchange_order_id: order.exchange_order_id})
                        else kucoinController.cancelSpotOrder({isStop: true, userExchange, exchange_order_id: order.exchange_order_id})
                    })
                    sendTelegramNotificationByUserExchange({userExchange, text: telegramConstant.stopSignalAndTpOrdersRemoved})
                })
        })
}

export default removeTpOrders