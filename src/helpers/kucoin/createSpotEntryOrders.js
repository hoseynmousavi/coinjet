import userExchangeController from "../../controllers/userExchangeController"
import userExchangeConstant from "../../constants/userExchangeConstant"
import kucoinController from "../../controllers/kucoinController"
import orderController from "../../controllers/orderController"
import sendTelegramNotificationByUserExchange from "../telegram/sendTelegramNotificationByUserExchange"
import telegramConstant from "../../constants/telegramConstant"
import getCurrencyFromPair from "../getCurrencyFromPair"
import pairToFuturesSymbol from "./pairToFuturesSymbol"
import pairToSpotSymbol from "./pairToSpotSymbol"

function createSpotEntryOrders({userExchanges, signal})
{
    userExchanges.forEach(userExchange =>
    {
        kucoinController.getSpotAccountOverview({userExchange, currency: getCurrencyFromPair({index: 1, pair: signal.pair}), type: "trade"})
            .then(accounts =>
            {
                const {available: availableBalance} = accounts[0] || {}
                if (availableBalance)
                {
                    const balance = availableBalance * (userExchange.usePercentOfBalance || 0.1) / signal.entry.length
                    signal.entry.forEach((price, index) =>
                    {
                        const size = (balance / price).toFixed(8)
                        const symbol = pairToSpotSymbol({pair: signal.pair})
                        orderController.addOrder({
                            user_id: userExchange.user_id,
                            signal_id: signal._id,
                            price,
                            size,
                            symbol,
                            type: "entry",
                            entry_or_tp_index: index,
                            status: "open",
                        })
                            .then(order =>
                            {
                                kucoinController.createSpotOrder({
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
                            })
                    })
                    sendTelegramNotificationByUserExchange({
                        userExchange,
                        text: telegramConstant.signalFoundAndOrdersCreated({
                            isFutures: signal.is_futures,
                            ordersCount: signal.entry.length,
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
            })
    })
}

export default createSpotEntryOrders