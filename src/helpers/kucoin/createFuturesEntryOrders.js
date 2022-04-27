import kucoinController from "../../controllers/kucoinController"
import pairToFuturesSymbol from "./pairToFuturesSymbol"
import orderController from "../../controllers/orderController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"
import telegramController from "../../controllers/telegramController"
import userController from "../../controllers/userController"

function createFuturesEntryOrders({isBroadcast, userExchanges, signal})
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
                            kucoinController.getFutureAccountOverview({userExchange})
                                .then(overview =>
                                {
                                    const {availableBalance} = overview || {}
                                    const usdtBalance = Math.floor(availableBalance * Math.min(0.95, userExchange.usePercentOfBalance || 0.1) * signal.leverage / signal.entry.length)
                                    kucoinController.getFuturesActiveContracts()
                                        .then(contracts =>
                                        {
                                            const symbol = pairToFuturesSymbol({pair: signal.pair})
                                            const contract = contracts.filter(item => item.symbol === symbol)?.[0]
                                            if (contract)
                                            {
                                                const {multiplier} = contract
                                                const enoughUsdtAndContract = signal.entry.every(price => usdtBalance / price >= multiplier)
                                                if (enoughUsdtAndContract)
                                                {
                                                    submitOrders({signal, usdtBalance, multiplier, symbol, userExchange})
                                                        .then(() =>
                                                        {
                                                            sendTelegramNotificationByUserExchange({
                                                                userExchange,
                                                                text: telegramConstant.signalFoundAndOrdersCreated({
                                                                    isFutures: signal.is_futures,
                                                                    ordersCount: signal.entry.length,
                                                                    isShort: signal.is_short,
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
                                            }
                                            else
                                            {
                                                sendTelegramNotificationByUserExchange({
                                                    userExchange,
                                                    text: telegramConstant.signalFoundButNoCoinSupport,
                                                })
                                            }
                                        })
                                })
                        }
                    })
            })
    })
}

async function submitOrders({signal, usdtBalance, multiplier, symbol, userExchange})
{
    for (let index = 0; index < signal.entry.length; index++)
    {
        const price = signal.entry[index]
        const size = Math.floor((usdtBalance / price) / multiplier)
        const order = await orderController.addOrder({
            user_exchange_id: userExchange._id,
            signal_id: signal._id,
            price,
            size,
            lot: multiplier,
            symbol,
            type: "entry",
            entry_or_tp_index: index,
            status: "open",
        })
        await kucoinController.createFutureOrder({
            userExchange,
            order: {
                type: "limit",
                clientOid: order._id,
                side: signal.is_short ? "sell" : "buy",
                symbol: order.symbol,
                leverage: signal.leverage,
                price: order.price,
                size: order.size,
            },
        })
    }
}

export default createFuturesEntryOrders