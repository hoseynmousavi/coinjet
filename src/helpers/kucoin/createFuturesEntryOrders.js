import kucoinController from "../../controllers/kucoinController"
import pairToFuturesSymbol from "./pairToFuturesSymbol"
import orderController from "../../controllers/orderController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"
import telegramController from "../../controllers/telegramController"
import userController from "../../controllers/userController"

function createFuturesEntryOrders({isBroadcast, userExchanges, signal})
{
    const {_id: signal_id, title, telegram_chat_id, leverage, use_balance_percent, entries, pair, is_futures, is_short} = signal
    userExchanges.forEach(userExchange =>
    {
        userController.getUserById({_id: userExchange.user_id})
            .then(user =>
            {
                telegramController.checkSubscription({isBroadcast, telegram_chat_id, user_id: user.telegram_id})
                    .then(isSubscribed =>
                    {
                        if (isSubscribed)
                        {
                            kucoinController.getFutureAccountOverview({userExchange})
                                .then(({availableBalance}) =>
                                {
                                    const usdtBalance = Math.floor(use_balance_percent / leverage / 100 * availableBalance)
                                    kucoinController.getFuturesActiveContracts()
                                        .then(contracts =>
                                        {
                                            const symbol = pairToFuturesSymbol({pair})
                                            const contract = contracts.filter(item => item.symbol === symbol)?.[0]
                                            if (contract)
                                            {
                                                const {multiplier} = contract
                                                const enoughUsdtAndContract = entries.every(({price, percent}) => (percent / 100) * usdtBalance / price >= multiplier)
                                                if (enoughUsdtAndContract)
                                                {
                                                    submitOrders({
                                                        signal_id,
                                                        is_short,
                                                        leverage,
                                                        entries,
                                                        usdtBalance,
                                                        multiplier,
                                                        symbol,
                                                        userExchange,
                                                    })
                                                        .then(() =>
                                                        {
                                                            sendTelegramNotificationByUserExchange({
                                                                userExchange,
                                                                title,
                                                                text: telegramConstant.signalFoundAndOrdersCreated({
                                                                    isFutures: is_futures,
                                                                    ordersCount: entries.length,
                                                                    pair,
                                                                }),
                                                            })
                                                        })
                                                        .catch(() =>
                                                        {
                                                            sendTelegramNotificationByUserExchange({
                                                                userExchange,
                                                                title,
                                                                text: telegramConstant.signalFoundButErr({
                                                                    isFutures: is_futures,
                                                                    pair,
                                                                }),
                                                            })
                                                        })
                                                }
                                                else
                                                {
                                                    sendTelegramNotificationByUserExchange({
                                                        userExchange,
                                                        title,
                                                        text: telegramConstant.signalFoundButNoBalance,
                                                    })
                                                }
                                            }
                                            else
                                            {
                                                sendTelegramNotificationByUserExchange({
                                                    userExchange,
                                                    title,
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

async function submitOrders({signal_id, is_short, leverage, entries, usdtBalance, multiplier, symbol, userExchange})
{
    for (let index = 0; index < entries.length; index++)
    {
        const {percent, price} = entries[index]
        const size = Math.floor((percent / 100) * usdtBalance / price / multiplier)
        const order = await orderController.addOrder({
            user_exchange_id: userExchange._id,
            signal_id,
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
                side: is_short ? "sell" : "buy",
                symbol: order.symbol,
                leverage,
                price: order.price,
                size: order.size,
            },
        })
    }
}

export default createFuturesEntryOrders