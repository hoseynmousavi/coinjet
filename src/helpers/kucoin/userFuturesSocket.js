import request from "../../request/request"
import kucoinConstant from "../../constants/kucoinConstant"
import getRandomId from "../getRandomId"
import WebSocket from "ws"
import userExchangeController from "../../controllers/userExchangeController"
import userExchangeConstant from "../../constants/userExchangeConstant"

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
                                    if (event.type !== "pong") console.log("message", event)
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