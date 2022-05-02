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

            submitOrders({targets, userExchange, signal_id, size, lot, symbol, entry_or_tp_index, is_short})
                .then(({tpCount}) =>
                {
                    sendTelegramNotificationByUserExchange({
                        userExchange,
                        text: telegramConstant.entryOrderFilledAndTPsAdded({tpCount, entryIndex: entry_or_tp_index + 1}),
                    })
                })
                .catch((e) =>
                {
                    console.log(e)
                    sendTelegramNotificationByUserExchange({
                        userExchange,
                        text: telegramConstant.entryOrderFilledAndTPsFailed({entryIndex: entry_or_tp_index + 1}),
                    })
                })
        })
}

async function submitOrders({targets, userExchange, signal_id, size, lot, symbol, entry_or_tp_index, is_short})
{
    let tpCount = 0
    let remainedSize = size

    for (let index = 0; index < targets.length; index++)
    {
        const {percent, price} = targets[index]
        if (index < targets.length - 1 || remainedSize)
        {
            console.log({remainedSize, index, size})
            tpCount++
            const sizeTemp = index === targets.length - 1 ? remainedSize : Math.min(size, Math[size <= targets.length ? "ceil" : "floor"](percent / 100 * size))
            remainedSize -= sizeTemp
            console.log({remainedSize})
            const order = await orderController.addOrder({
                user_exchange_id: userExchange._id,
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
            await kucoinController.createFutureOrder({
                userExchange,
                order: {
                    type: "market",
                    clientOid: order._id,
                    side: is_short ? "buy" : "sell",
                    symbol: order.symbol,
                    leverage: 1,
                    size: order.size,
                    stop: is_short ? "down" : "up",
                    stopPrice: order.price,
                },
            })
            if (index === targets.length - 1) return {tpCount}
        }
    }
}

export default createFuturesStopAndTpOrders