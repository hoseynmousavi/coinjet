import signalController from "../../controllers/signalController"
import orderController from "../../controllers/orderController"
import kucoinController from "../../controllers/kucoinController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"
import indexToLetter from "../indexToLetter"

function updateFuturesStopOrder({tpOrder, userExchange})
{
    const {signal_id, entry_fill_index, entry_or_tp_index, price} = tpOrder
    const {user_id} = userExchange

    signalController.getSignalById({signal_id})
        .then(signal =>
        {
            const {title, entries, is_short, is_futures, pair} = signal
            orderController.findOrders({query: {user_id, entry_fill_index, signal_id}})
                .then(orders =>
                {
                    const stopOrders = orders.filter(order => order.type === "stop")
                    const stopOrder = stopOrders[stopOrders.length - 1]
                    kucoinController.cancelFutureOrder({userExchange, exchange_order_id: stopOrder.exchange_order_id})

                    const tpOrders = orders.filter(order => order.type === "tp" && order.entry_or_tp_index > entry_or_tp_index)
                    if (tpOrders.length)
                    {
                        orderController.addOrder({
                            user_exchange_id: stopOrder.user_exchange_id,
                            signal_id: stopOrder.signal_id,
                            price: entries[stopOrder.entry_fill_index].price,
                            size: tpOrders.reduce((sum, order) => sum + order.size, 0),
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
                                        side: is_short ? "buy" : "sell",
                                        symbol: order.symbol,
                                        leverage: 1,
                                        size: order.size,
                                        stop: is_short ? "up" : "down",
                                        stopPrice: order.price,
                                    },
                                })
                                    .then(() =>
                                    {
                                        sendTelegramNotificationByUserExchange({
                                            userExchange,
                                            title,
                                            text: telegramConstant.tpFilled({
                                                tpIndex: indexToLetter(entry_or_tp_index + 1),
                                                pair,
                                                isFutures: is_futures,
                                                firstTp: entry_or_tp_index === 0,
                                                profitInPercent: ((price / entries[entry_fill_index].price) - 1) * 100,
                                            }),
                                        })
                                    })
                                    .catch(e =>
                                    {
                                        console.log(e)
                                        sendTelegramNotificationByUserExchange({
                                            userExchange,
                                            title,
                                            text: telegramConstant.tpFilledButStopErr({
                                                tpIndex: indexToLetter(entry_or_tp_index + 1),
                                                pair,
                                                isFutures: is_futures,
                                                profitInPercent: ((price / entries[entry_fill_index].price) - 1) * 100,
                                            }),
                                        })
                                    })
                            })
                    }
                    else
                    {
                        orderController.findOrders({query: {user_id, type: "entry", status: "open", signal_id}})
                            .then(orders =>
                            {
                                orders.forEach(order =>
                                {
                                    kucoinController.cancelFutureOrder({userExchange, exchange_order_id: order.exchange_order_id})
                                })
                            })

                        sendTelegramNotificationByUserExchange({
                            userExchange,
                            title,
                            text: telegramConstant.tpFilled({
                                tpIndex: "اخرین",
                                pair,
                                isFutures: is_futures,
                                firstTp: false,
                                profitInPercent: ((price / entries[entry_fill_index].price) - 1) * 100,
                            }),
                        })
                    }
                })
        })
}

export default updateFuturesStopOrder