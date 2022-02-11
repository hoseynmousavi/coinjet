import orderController from "../../controllers/orderController"
import signalController from "../../controllers/signalController"
import kucoinController from "../../controllers/kucoinController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"

function removeFuturesTpOrders({stopOrder, userExchange})
{
    signalController.getSignalById({signal_id: stopOrder.signal_id})
        .then(signal =>
        {
            orderController.findOrders({query: {user_id: userExchange.user_id, type: "tp", entry_fill_index: stopOrder.entry_fill_index, signal_id: signal._id}})
                .then(orders =>
                {
                    orders.forEach(order =>
                    {
                        kucoinController.cancelFutureOrder({userExchange, exchange_order_id: order.exchange_order_id})
                    })
                    sendTelegramNotificationByUserExchange({userExchange, text: telegramConstant.stopSignalAndTpOrdersRemoved})
                })
        })
}

export default removeFuturesTpOrders