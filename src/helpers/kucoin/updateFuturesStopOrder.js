import signalController from "../../controllers/signalController"
import orderController from "../../controllers/orderController"
import kucoinController from "../../controllers/kucoinController"

function updateFuturesStopOrder({tpOrder, userExchange})
{
    signalController.getSignalById({signal_id: tpOrder.signal_id})
        .then(signal =>
        {
            orderController.findOrders({query: {user_id: userExchange.user_id, type: "stop", entry_fill_index: tpOrder.entry_fill_index, signal_id: signal._id}})
                .then(orders =>
                {
                    if (orders.length === 1)
                    {
                        const order = orders[0]
                        if (order.price !== signal.entry[order.entry_fill_index])
                        {
                            kucoinController.cancelFutureOrder({userExchange, exchange_order_id: order.exchange_order_id})

                            orderController.addOrder({
                                user_id: order.user_id,
                                signal_id: order.signal_id,
                                price: signal.entry[order.entry_fill_index],
                                size: order.size,
                                lot: order.lot,
                                symbol: order.symbol,
                                type: order.type,
                                entry_fill_index: order.entry_fill_index,
                                status: order.status,
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
                        }
                    }
                })
        })
}

export default updateFuturesStopOrder