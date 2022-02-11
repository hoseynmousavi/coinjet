import userExchangeController from "../../controllers/userExchangeController"
import userExchangeConstant from "../../constants/userExchangeConstant"
import kucoinController from "../../controllers/kucoinController"
import pairToFuturesSymbol from "./pairToFuturesSymbol"
import orderController from "../../controllers/orderController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"

function createFuturesEntryOrders({signal})
{
    userExchangeController.getUserExchanges({is_futures: true, progress_level: userExchangeConstant.progress_level.complete})
        .then(userExchanges =>
        {
            userExchanges.forEach(userExchange =>
            {
                kucoinController.getFutureAccountOverview({userExchange})
                    .then(overview =>
                    {
                        const {availableBalance} = overview || {}
                        const usdtBalance = Math.floor(availableBalance * (userExchange.usePercentOfBalance || 0.1) * signal.leverage / signal.entry.length)
                        kucoinController.getFuturesActiveContracts()
                            .then(contracts =>
                            {
                                const symbol = pairToFuturesSymbol({pair: signal.pair})
                                const contract = contracts.filter(item => item.symbol === symbol)?.[0]
                                const enoughUsdtAndContract = signal.entry.every(price => contract && usdtBalance / price >= contract.multiplier)
                                if (enoughUsdtAndContract)
                                {
                                    signal.entry.forEach((price, index) =>
                                    {
                                        const size = Math.floor((usdtBalance / price) / contract.multiplier)
                                        orderController.addOrder({
                                            user_id: userExchange.user_id,
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
                                        text: telegramConstant.signalFoundAndOrdersCreated({ordersCount: signal.entry.length, isShort: signal.is_short}),
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
                    })
            })
        })
}

export default createFuturesEntryOrders