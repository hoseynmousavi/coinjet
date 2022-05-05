import signalController from "../../controllers/signalController"
import orderController from "../../controllers/orderController"
import kucoinController from "../../controllers/kucoinController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"
import countDecimalPoints from "../countDecimalPoints"
import indexToLetter from "../indexToLetter"

function createSpotStopAndTpOrders({entryOrder, userExchange})
{
    const {signal_id, size, base_min_size, base_increment, symbol, entry_or_tp_index} = entryOrder
    const {_id: userExchangeId} = userExchange

    signalController.getSignalById({signal_id})
        .then(signal =>
        {
            const {stop, title, targets, pair, is_futures} = signal
            orderController.addOrder({
                user_exchange_id: userExchangeId,
                signal_id,
                price: stop,
                size,
                base_min_size,
                base_increment,
                symbol,
                type: "stop",
                entry_fill_index: entry_or_tp_index,
                status: "open",
            })
                .then(order =>
                {
                    const {_id: orderId, symbol, size, price} = order
                    kucoinController.createSpotOrder({
                        userExchange,
                        order: {
                            type: "market",
                            clientOid: orderId,
                            side: "sell",
                            symbol,
                            size,
                            stop: "loss",
                            stopPrice: price,
                        },
                    })
                        .then(() =>
                        {
                            submitOrders({targets, userExchange, signal_id, size, base_min_size, base_increment, symbol, entry_or_tp_index})
                                .then(({tpCount}) =>
                                {
                                    sendTelegramNotificationByUserExchange({
                                        userExchange,
                                        title,
                                        text: telegramConstant.entryOrderFilledAndStopTpAdded({
                                            entryIndex: indexToLetter(entry_or_tp_index + 1),
                                            pair,
                                            isFutures: is_futures,
                                            ordersCount: tpCount,
                                        }),
                                    })
                                })
                                .catch(e =>
                                {
                                    console.log(e)
                                    sendTelegramNotificationByUserExchange({
                                        userExchange,
                                        title,
                                        text: telegramConstant.entryOrderFilledAndStopTpFailed({
                                            entryIndex: indexToLetter(entry_or_tp_index + 1),
                                            pair,
                                            isFutures: is_futures,
                                        }),
                                    })
                                })
                        })
                        .catch(e =>
                        {
                            console.log(e)
                            sendTelegramNotificationByUserExchange({
                                userExchange,
                                title,
                                text: telegramConstant.entryOrderFilledAndStopTpFailed({
                                    entryIndex: indexToLetter(entry_or_tp_index + 1),
                                    pair,
                                    isFutures: is_futures,
                                }),
                            })
                        })
                })
        })
}

async function submitOrders({targets, userExchange, signal_id, size, base_min_size, base_increment, symbol, entry_or_tp_index})
{
    let tpCount = 0
    let remainedSize = size

    for (let index = 0; index < targets.length; index++)
    {
        const {percent, price} = targets[index]
        if (remainedSize)
        {
            tpCount++
            let sizeTemp = index === targets.length - 1 ? remainedSize : Math.min(size, Math.max(base_min_size, +(percent / 100 * size).toFixed(countDecimalPoints(base_increment))))
            remainedSize = (remainedSize - sizeTemp).toFixed(countDecimalPoints(base_increment))
            if (remainedSize < base_min_size)
            {
                sizeTemp = +(sizeTemp + remainedSize).toFixed(countDecimalPoints(base_increment))
                remainedSize = 0
            }
            const order = await orderController.addOrder({
                user_exchange_id: userExchange._id,
                signal_id,
                price,
                size: sizeTemp,
                base_min_size,
                base_increment,
                symbol,
                type: "tp",
                entry_fill_index: entry_or_tp_index,
                entry_or_tp_index: index,
                status: "open",
            })
            await kucoinController.createSpotOrder({
                userExchange,
                order: {
                    type: "market",
                    clientOid: order._id,
                    side: "sell",
                    symbol: order.symbol,
                    size: order.size,
                    stop: "entry",
                    stopPrice: order.price,
                },
            })
        }
        if (index === targets.length - 1) return {tpCount}
    }
}

export default createSpotStopAndTpOrders