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
    const {_id: signal_id, telegram_chat_id, leverage, entries, pair, risk, is_futures} = signal
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
                            kucoinController.getSpotAccountOverview({userExchange, currency: getCurrencyFromPair({index: 1, pair}), type: "trade"})
                                .then(accounts =>
                                {
                                    const {available} = accounts[0] || {}
                                    const availableBalance = +available
                                    const balance = (Math.min(100, risk * leverage) / 100) * availableBalance
                                    kucoinController.getSpotSymbols()
                                        .then(symbols =>
                                        {
                                            const symbol = pairToSpotSymbol({pair})
                                            const contract = symbols.filter(item => item.symbol === symbol)?.[0]
                                            console.log({symbol, contract})
                                            if (contract)
                                            {
                                                const {baseMinSize} = contract
                                                const enoughBalanceAndContract = entries.every(({price, percent}) => (percent / 100) * balance / price >= +baseMinSize)
                                                if (enoughBalanceAndContract)
                                                {
                                                    submitOrders({signal_id, entries, balance, symbol, userExchange})
                                                        .then(() =>
                                                        {
                                                            sendTelegramNotificationByUserExchange({
                                                                userExchange,
                                                                text: telegramConstant.signalFoundAndOrdersCreated({
                                                                    isFutures: is_futures,
                                                                    ordersCount: entries.length,
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

async function submitOrders({signal_id, entries, balance, symbol, userExchange})
{
    for (let index = 0; index < entries.length; index++)
    {
        const {percent, price} = entries[index]
        const size = ((percent / 100) * balance / price).toFixed(8)
        console.log({size})
        const order = await orderController.addOrder({
            user_exchange_id: userExchange._id,
            signal_id,
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