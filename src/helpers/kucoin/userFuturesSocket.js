import request from "../../request/request"
import kucoinConstant from "../../constants/kucoinConstant"
import WebSocket from "ws"
import userExchangeController from "../../controllers/userExchangeController"
import userExchangeConstant from "../../constants/userExchangeConstant"
import orderController from "../../controllers/orderController"
import createFuturesStopAndTpOrders from "./createFuturesStopAndTpOrders"
import updateFuturesStopOrder from "./updateFuturesStopOrder"
import removeTpOrders from "./removeTpOrders"

let userExchangeSockets = {}

function start()
{
    userExchangeController.getUserExchanges({query: {is_futures: true, progress_level: userExchangeConstant.progress_level.complete}})
        .then(userExchanges =>
        {
            userExchanges.forEach(userExchange => startUserSocket({userExchange}))
        })
}

function startUserSocket({userExchange})
{
    request.post({
        url: kucoinConstant.future.getPrivateSocket,
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
                    userExchangeSockets[userExchange._id] = socket
                    setInterval(() => socket.send(JSON.stringify({id, type: "ping"})), pingInterval)
                    socket.send(JSON.stringify({id, type: "subscribe", topic: "/contractMarket/tradeOrders", privateChannel: true, response: true}))
                }
                socket.onmessage = item =>
                {
                    const event = JSON.parse(item.data)
                    if (event.type !== "pong")
                    {
                        // console.log("message", event)
                        if (event.topic === "/contractMarket/tradeOrders" && event.data?.status === "done" && (event.data?.type === "filled" || event.data?.type === "canceled"))
                        {
                            try
                            {
                                orderController.updateOrder({
                                    query: {_id: event.data.clientOid, status: "open"},
                                    update: {status: event.data.type, updated_date: new Date()},
                                })
                                    .then((updatedOrder) =>
                                    {
                                        if (updatedOrder?.status === "filled")
                                        {
                                            if (updatedOrder.type === "entry")
                                            {
                                                createFuturesStopAndTpOrders({entryOrder: updatedOrder, userExchange})
                                            }
                                            else if (updatedOrder.type === "stop")
                                            {
                                                removeTpOrders({isFutures: true, stopOrder: updatedOrder, userExchange})
                                            }
                                            else if (updatedOrder.type === "tp")
                                            {
                                                updateFuturesStopOrder({tpOrder: updatedOrder, userExchange})
                                            }
                                        }
                                    })
                            }
                            catch (e)
                            {
                                console.log("error in updateOrder", e)
                            }
                        }
                    }
                }
                socket.onclose = () =>
                {
                    console.log("closed")
                    if (userExchangeSockets[userExchange._id]) startUserSocket({userExchange})
                }
                socket.onerror = item =>
                {
                    console.log("error", item.data)
                    if (userExchangeSockets[userExchange._id]) startUserSocket({userExchange})
                }
            }
        })
}

function closeSocket({userExchangeId})
{
    delete userExchangeSockets[userExchangeId]
    userExchangeSockets[userExchangeId]?.close?.()
}

const userFuturesSocket = {
    start,
    startUserSocket,
    closeSocket,
}

export default userFuturesSocket