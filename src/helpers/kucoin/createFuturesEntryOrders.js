import kucoinController from "../../controllers/kucoinController"
import pairToFuturesSymbol from "./pairToFuturesSymbol"
import orderController from "../../controllers/orderController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"
import telegramController from "../../controllers/telegramController"
import userController from "../../controllers/userController"

function createFuturesEntryOrders({userExchanges, signal})
{
    userExchanges.forEach(userExchange =>
    {
        userController.getUserById({_id: userExchange.user_id})
            .then(user =>
            {
                telegramController.checkSubscription({telegram_chat_id: signal.telegram_chat_id, user_id: user.telegram_id})
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
                                                const enoughUsdtAndContract = signal.entry.every(price => usdtBalance / price >= contract.multiplier)
                                                if (enoughUsdtAndContract)
                                                {
                                                    signal.entry.forEach((price, index) =>
                                                    {
                                                        const size = Math.floor((usdtBalance / price) / contract.multiplier)
                                                        orderController.addOrder({
                                                            user_exchange_id: userExchange._id,
                                                            signal_id: signal._id,
                                                            price,
                                                            size,
                                                            lot: contract.multiplier,
                                                            symbol,
                                                            type: "entry",
                                                            entry_or_tp_index: index,
                                                            status: "open",
                                                        })
                                                            .then(order =>
                                                            {
                                                                kucoinController.createFutureOrder({
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
                                                            })
                                                    })
                                                    sendTelegramNotificationByUserExchange({
                                                        userExchange,
                                                        text: telegramConstant.signalFoundAndOrdersCreated({
                                                            isFutures: signal.is_futures,
                                                            ordersCount: signal.entry.length,
                                                            isShort: signal.is_short,
                                                        }),
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

export default createFuturesEntryOrders