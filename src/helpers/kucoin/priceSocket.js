import request from "../../request/request"
import kucoinConstant from "../../constants/kucoinConstant"
import getRandomId from "../getRandomId"
import WebSocket from "ws"

let socket = null
let socketInterval = null

function priceSocket()
{
    request.post({
        url: kucoinConstant.spot.getPublicSocket,
        isKuCoin: true,
    })
        .then(res =>
        {
            const {token, instanceServers} = res?.data || {}
            const {endpoint, pingInterval, pingTimeout} = instanceServers?.[0]
            if (token && endpoint)
            {
                const id = getRandomId()
                socket = new WebSocket(`${endpoint}?token=${token}&[connectId=${id}]`)
                socket.onopen = () =>
                {
                    socketInterval = setInterval(() => socket.send(JSON.stringify({id, type: "ping"})), pingInterval)
                    socket.send(JSON.stringify({
                        id,
                        type: "subscribe",
                        topic: "/indicator/markPrice:USDT-BTC",
                        response: false,
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
}

export default priceSocket