import signalController from "../../controllers/signalController"
import orderController from "../../controllers/orderController"
import kucoinController from "../../controllers/kucoinController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"

function createFuturesStopAndTpOrders({entryOrder, userExchange})
{
    const {signal_id, size, lot, symbol, entry_or_tp_index} = entryOrder
    const {_id: userExchangeId} = userExchange

    signalController.getSignalById({signal_id: entryOrder.signal_id})
        .then(signal =>
        {
            const {stop, is_short, targets} = signal
            orderController.addOrder({
                user_exchange_id: userExchangeId,
                signal_id,
                price: stop,
                size,
                lot,
                symbol,
                type: "stop",
                entry_fill_index: entry_or_tp_index,
                status: "open",
            })
                .then(order =>
                {
                    const {_id: orderId, symbol, size, price} = order
                    kucoinController.createFutureOrder({
                        userExchange,
                        order: {
                            type: "market",
                            clientOid: orderId,
                            side: is_short ? "buy" : "sell",
                            symbol: symbol,
                            leverage: 1,
                            size,
                            stop: is_short ? "up" : "down",
                            stopPrice: price,
                        },
                    })
                        .then(() =>
                        {
                            sendTelegramNotificationByUserExchange({
                                userExchange,
                                text: telegramConstant.entryOrderFilledAndStopAdded({entryIndex: entry_or_tp_index + 1}),
                            })
                        })
                        .catch(() =>
                        {
                            sendTelegramNotificationByUserExchange({
                                userExchange,
                                text: telegramConstant.entryOrderFilledAndStopFailed({entryIndex: entry_or_tp_index + 1}),
                            })
                        })
                })

            let tpCount = 0
            let remainedSize = size

            submitOrders({targets, tpCount, remainedSize, userExchangeId, signal_id, size, lot, symbol, entry_or_tp_index, is_short})
                .then(() =>
                {
                    sendTelegramNotificationByUserExchange({
                        userExchange,
                        text: telegramConstant.entryOrderFilledAndTPsAdded({tpCount, entryIndex: entry_or_tp_index + 1}),
                    })
                })
                .catch(() =>
                {
                    sendTelegramNotificationByUserExchange({
                        userExchange,
                        text: telegramConstant.entryOrderFilledAndTPsFailed({entryIndex: entry_or_tp_index + 1}),
                    })
                })
        })
}

async function submitOrders({targets, tpCount, remainedSize, userExchangeId, signal_id, size, lot, symbol, entry_or_tp_index, is_short})
{
    for (let index = 0; index < targets.length; index++)
    {
        const {percent, price} = targets[index]
        if (index < targets.length - 1 || remainedSize)
        {
            tpCount++
            const sizeTemp = index === targets.length - 1 ? remainedSize : Math.min(size, Math[size <= targets.length ? "ceil" : "floor"](percent / 100 * size))
            remainedSize -= sizeTemp
            const order = await orderController.addOrder({
                user_exchange_id: userExchangeId,
                signal_id,
                price,
                size: sizeTemp,
                lot,
                symbol,
                type: "tp",
                entry_fill_index: entry_or_tp_index,
                entry_or_tp_index: index,
                status: "open",
            })
            const {_id: orderId, symbol, size, price} = order
            await kucoinController.createFutureOrder({
                userExchange,
                order: {
                    type: "market",
                    clientOid: orderId,
                    side: is_short ? "buy" : "sell",
                    symbol,
                    leverage: 1,
                    size,
                    stop: is_short ? "down" : "up",
                    stopPrice: price,
                },
            })
        }
    }
}

export default createFuturesStopAndTpOrders