import request from "../../request/request"
import kucoinConstant from "../../constants/kucoinConstant"
import WebSocket from "ws"
import userExchangeController from "../../controllers/userExchangeController"
import userExchangeConstant from "../../constants/userExchangeConstant"
import orderController from "../../controllers/orderController"
import kucoinController from "../../controllers/kucoinController"
import signalController from "../../controllers/signalController"
import {re} from "@babel/core/lib/vendor/import-meta-resolve"

function userFuturesSocket()
{
    userExchangeController.getUserExchanges({is_futures: true, progress_level: userExchangeConstant.progress_level.complete})
        .then(userExchanges =>
        {
            userExchanges.forEach(userExchange =>
            {
                request.post({
                    url: kucoinConstant.spot.getPrivateSocket,
                    isKucoinFuture: true,
                    kuCoinUserExchange: userExchange,
                })
                    .then(res =>
                    {
                        const {token, instanceServers} = res?.data || {}
                        const {endpoint, pingInterval, pingTimeout} = instanceServers?.[0]
                        if (token && endpoint)
                        {
                            const id = userExchange.user_id
                            const socket = new WebSocket(`${endpoint}?token=${token}&[connectId=${id}]`)
                            socket.onopen = () =>
                            {
                                setInterval(() => socket.send(JSON.stringify({id, type: "ping"})), pingInterval)
                                socket.send(JSON.stringify({
                                    id,
                                    type: "subscribe",
                                    topic: "/contractMarket/tradeOrders",
                                    privateChannel: true,
                                    response: true,
                                }))
                            }
                            socket.onmessage = item =>
                            {
                                try
                                {
                                    const event = JSON.parse(item.data)
                                    if (event.type !== "pong")
                                    {
                                        console.log("message", event)
                                        if (event.topic === "/contractMarket/tradeOrders" && event.data.status === "done" && (event.data.type === "filled" || event.data.type === "canceled"))
                                        {
                                            orderController.updateOrder({
                                                query: {_id: event.data.clientOid, status: "open"},
                                                update: {status: event.data.type, updated_date: new Date()},
                                            })
                                                .then((updatedOrder) =>
                                                {
                                                    if (updatedOrder.type === "entry" && updatedOrder?.status === "filled")
                                                    {
                                                        signalController.getSignalById({signal_id: updatedOrder.signal_id})
                                                            .then(signal =>
                                                            {
                                                                orderController.addOrder({
                                                                    user_id: userExchange.user_id,
                                                                    signal_id: updatedOrder.signal_id,
                                                                    price: signal.stop,
                                                                    size: updatedOrder.size,
                                                                    lot: updatedOrder.lot,
                                                                    symbol: updatedOrder.symbol,
                                                                    type: "stop",
                                                                    status: "open",
                                                                })
                                                                    .then(order =>
                                                                    {
                                                                        kucoinController.createFutureOrder({
                                                                            userExchange,
                                                                            order: {
                                                                                type: "market",
                                                                                clientOid: order._id,
                                                                                side: "sell",
                                                                                symbol: order.symbol,
                                                                                leverage: 1,
                                                                                size: order.size,
                                                                                stop: signal.is_short ? "up" : "down",
                                                                                stopPrice: signal.stop,
                                                                            },
                                                                        })
                                                                            .then(res => console.log({res}))
                                                                            .catch(err =>
                                                                            {
                                                                                console.error({err: err?.response?.data})
                                                                                orderController.removeOrder({order_id: order._id})
                                                                                    .then(ok => console.log({ok}))
                                                                                    .catch(err => console.log({err}))
                                                                            })
                                                                    })

                                                                let remainedSize = updatedOrder.size
                                                                signal.target.forEach((price, index) =>
                                                                {
                                                                    const size = index === signal.target.length - 1 ? remainedSize : Math[updatedOrder.size <= signal.target.length ? "ceil" : "floor"](updatedOrder.size / signal.target.length)
                                                                    remainedSize -= size
                                                                    orderController.addOrder({
                                                                        user_id: userExchange.user_id,
                                                                        signal_id: updatedOrder.signal_id,
                                                                        price,
                                                                        size: size,
                                                                        lot: updatedOrder.lot,
                                                                        symbol: updatedOrder.symbol,
                                                                        type: "tp",
                                                                        entry_or_tp_index: index,
                                                                        status: "open",
                                                                    })
                                                                        .then(order =>
                                                                        {
                                                                            kucoinController.createFutureOrder({
                                                                                userExchange,
                                                                                order: {
                                                                                    type: "market",
                                                                                    clientOid: order._id,
                                                                                    side: "sell",
                                                                                    symbol: order.symbol,
                                                                                    leverage: 1,
                                                                                    size: order.size,
                                                                                    stop: signal.is_short ? "down" : "up",
                                                                                    stopPrice: price,
                                                                                },
                                                                            })
                                                                                .then(res => console.log({res}))
                                                                                .catch(err =>
                                                                                {
                                                                                    console.error({err: err?.response?.data})
                                                                                    orderController.removeOrder({order_id: order._id})
                                                                                        .then(ok => console.log({ok}))
                                                                                        .catch(err => console.log({err}))
                                                                                })
                                                                        })
                                                                })
                                                            })
                                                    }
                                                })
                                        }
                                    }
                                }
                                catch (e)
                                {
                                    console.log(item)
                                }
                            }
                            socket.onclose = () =>
                            {
                                console.log("closed")
                            }
                            socket.onerror = item =>
                            {
                                console.log("error", item.data)
                            }
                        }
                    })
            })
        })
}

export default userFuturesSocket