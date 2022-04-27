import kucoinController from "../../controllers/kucoinController"
import orderController from "../../controllers/orderController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"
import getCurrencyFromPair from "../getCurrencyFromPair"
import pairToSpotSymbol from "./pairToSpotSymbol"
import userController from "../../controllers/userController"
import telegramController from "../../controllers/telegramController"

function createSpotEntryOrders({isBroadcast, userExchanges, signal})
{
    userExchanges.forEach(userExchange =>
    {
        userController.getUserById({_id: userExchange.user_id})
            .then(user =>
            {
                telegramController.checkSubscription({isBroadcast, telegram_chat_id: signal.telegram_chat_id, user_id: user.telegram_id})
                    .then(isSubscribed =>
                    {
                        if (isSubscribed)
                        {
                            kucoinController.getSpotAccountOverview({userExchange, currency: getCurrencyFromPair({index: 1, pair: signal.pair}), type: "trade"})
                                .then(accounts =>
                                {
                                    const {available} = accounts[0] || {}
                                    const availableBalance = +available
                                    if (availableBalance)
                                    {
                                        const balance = availableBalance * (userExchange.usePercentOfBalance || 0.1) / signal.entry.length
                                        const symbol = pairToSpotSymbol({pair: signal.pair})
                                        submitOrders({signal, balance, symbol, userExchange})
                                            .then(() =>
                                            {
                                                sendTelegramNotificationByUserExchange({
                                                    userExchange,
                                                    text: telegramConstant.signalFoundAndOrdersCreated({
                                                        isFutures: signal.is_futures,
                                                        ordersCount: signal.entry.length,
                                                    }),
                                                })
                                            })
                                            .catch(() =>
                                            {
                                                sendTelegramNotificationByUserExchange({
                                                    userExchange,
                                                    text: telegramConstant.signalFoundButErr,
                                                })
                                            })
                                    }
                                    else
                                    {
                                        sendTelegramNotificationByUserExchange({
                                            userExchange,
                                            text: telegramConstant.signalFoundButNoBalance,
                                        })
                                    }
                                })
                        }
                    })
            })
    })
}

async function submitOrders({signal, balance, symbol, userExchange})
{
    for (let index = 0; index < signal.entry.length; index++)
    {
        const price = signal.entry[index]
        const size = (balance / price).toFixed(8)
        const order = await orderController.addOrder({
            user_exchange_id: userExchange._id,
            signal_id: signal._id,
            price,
            size,
            symbol,
            type: "entry",
            entry_or_tp_index: index,
            status: "open",
        })
        await kucoinController.createSpotOrder({
            userExchange,
            order: {
                type: "limit",
                clientOid: order._id,
                side: "buy",
                symbol: order.symbol,
                price: order.price,
                size: order.size,
            },
        })
    }
}

export default createSpotEntryOrders