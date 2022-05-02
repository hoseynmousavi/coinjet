import signalController from "../../controllers/signalController"
import orderController from "../../controllers/orderController"
import kucoinController from "../../controllers/kucoinController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"

function createSpotStopAndTpOrders({entryOrder, userExchange})
{
    const {signal_id, size, symbol, entry_or_tp_index} = entryOrder
    const {_id: userExchangeId} = userExchange

    signalController.getSignalById({signal_id})
        .then(signal =>
        {
            const {stop, targets} = signal
            orderController.addOrder({
                user_exchange_id: userExchangeId,
                signal_id,
                price: stop,
                size,
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


            submitOrders({targets, userExchangeId, signal_id, size, symbol, entry_or_tp_index})
                .then(() =>
                {
                    sendTelegramNotificationByUserExchange({
                        userExchange,
                        text: telegramConstant.entryOrderFilledAndTPsAdded({tpCount: targets.length, entryIndex: entry_or_tp_index + 1}),
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

async function submitOrders({targets, userExchangeId, signal_id, size, symbol, entry_or_tp_index})
{
    for (let index = 0; index < targets.length; index++)
    {
        const {percent, price} = targets[index]
        const sizeTemp = percent / 100 * size
        const order = await orderController.addOrder({
            user_exchange_id: userExchangeId,
            signal_id,
            price,
            size: sizeTemp,
            symbol,
            type: "tp",
            entry_fill_index: entry_or_tp_index,
            entry_or_tp_index: index,
            status: "open",
        })
        const {_id: orderId, symbol, size} = order
        await kucoinController.createSpotOrder({
            userExchange,
            order: {
                type: "market",
                clientOid: orderId,
                side: "sell",
                symbol,
                size,
                stop: "entry",
                stopPrice: price,
            },
        })
    }
}

export default createSpotStopAndTpOrders