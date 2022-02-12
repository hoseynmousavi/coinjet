import signalController from "../../controllers/signalController"
import orderController from "../../controllers/orderController"
import kucoinController from "../../controllers/kucoinController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"

function updateSpotStopOrder({tpOrder, userExchange})
{
    signalController.getSignalById({signal_id: tpOrder.signal_id})
        .then(signal =>
        {
            orderController.findOrders({query: {user_id: userExchange.user_id, entry_fill_index: tpOrder.entry_fill_index, signal_id: signal._id}})
                .then(orders =>
                {
                    const stopOrders = orders.filter(order => order.type === "stop")
                    const stopOrder = stopOrders[stopOrders.length - 1]
                    kucoinController.cancelSpotOrder({isStop: true, userExchange, exchange_order_id: stopOrder.exchange_order_id})

                    const tpOrders = orders.filter(order => order.type === "tp")
                    if (tpOrder.entry_or_tp_index < signal.target.length - 1)
                    {
                        orderController.addOrder({
                            user_id: stopOrder.user_id,
                            signal_id: stopOrder.signal_id,
                            price: signal.entry[stopOrder.entry_fill_index],
                            size: tpOrders.reduce((sum, order) => sum + (order.entry_or_tp_index > tpOrder.entry_or_tp_index ? order.size : 0), 0),
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
                                sendTelegramNotificationByUserExchange({userExchange, text: telegramConstant.tpFilledAndStopUpdated({tpIndex: tpOrder.entry_or_tp_index + 1})})
                            })
                    }
                    else sendTelegramNotificationByUserExchange({userExchange, text: telegramConstant.tpFilledAndDone})

                })
        })
}

export default updateSpotStopOrder