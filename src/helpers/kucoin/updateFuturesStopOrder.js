import signalController from "../../controllers/signalController"
import orderController from "../../controllers/orderController"
import kucoinController from "../../controllers/kucoinController"

function updateFuturesStopOrder({tpOrder, userExchange})
{
    signalController.getSignalById({signal_id: tpOrder.signal_id})
        .then(signal =>
        {
            orderController.findOrders({query: {user_id: userExchange.user_id, entry_fill_index: tpOrder.entry_fill_index, signal_id: signal._id}})
                .then(orders =>
                {
                    const stopOrder = orders.filter(order => order.type === "stop")?.[0]
                    if (stopOrder) kucoinController.cancelFutureOrder({userExchange, exchange_order_id: stopOrder.exchange_order_id})

                    const tpOrders = orders.filter(order => order.type === "tp")
                    if (tpOrders.some(order => order.status !== "open"))
                    {
                        orderController.addOrder({
                            user_id: stopOrder.user_id,
                            signal_id: stopOrder.signal_id,
                            price: signal.entry[stopOrder.entry_fill_index],
                            size: tpOrders.reduce((sum, order) => sum + (order.status === "open" ? order.size : 0), 0),
                            lot: stopOrder.lot,
                            symbol: stopOrder.symbol,
                            type: stopOrder.type,
                            entry_fill_index: stopOrder.entry_fill_index,
                            status: stopOrder.status,
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
                })
        })
}

export default updateFuturesStopOrder