import orderController from "../../controllers/orderController"
import signalController from "../../controllers/signalController"
import kucoinController from "../../controllers/kucoinController"

function removeFuturesTpOrders({stopOrder, userExchange})
{
    signalController.getSignalById({signal_id: stopOrder.signal_id})
        .then(signal =>
        {
            orderController.findOrders({query: {user_id: userExchange.user_id, type: "tp", signal_id: signal._id}})
                .then(orders =>
                {
                    orders.forEach(order =>
                    {
                        kucoinController.cancelFutureOrder({userExchange, exchange_order_id: order.exchange_order_id})
                    })
                })
        })
}

export default removeFuturesTpOrders