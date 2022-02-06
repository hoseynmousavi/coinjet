import request from "../request/request"
import kucoinConstant from "../constants/kucoinConstant"
import userFuturesSocket from "../helpers/kucoin/userFuturesSocket"
import userExchangeController from "./userExchangeController"
import userExchangeConstant from "../constants/userExchangeConstant"

function requestMiddleWareRes(req, res)
{
    const {user_id, url, method, data} = req.body || {}
    if (user_id && url && method)
    {
        userExchangeController.getUserExchangesByUserId({user_id, progress_level: userExchangeConstant.progress_level.complete})
            .then(userExchanges =>
            {
                request[method.toLowerCase() === "get" ? "get" : "post"]({url, isKucoinFuture: true, kuCoinUserExchange: userExchanges[0], data})
                    .then(result =>
                    {
                        res.send(result)
                    })
                    .catch(err =>
                    {
                        res.status(err?.response?.status || 500).send(err?.response?.data || {message: "we have err"})
                    })
            })
    }
    else res.status(400).send({message: "fields are incomplete."})
}

function getFutureAccountOverview({userExchange})
{
    return request.get({
        url: kucoinConstant.future.accountOverview,
        isKucoinFuture: true,
        kuCoinUserExchange: userExchange,
    })
        .then(res => res.data)
}

function getFuturePositions({userExchange})
{
    return request.get({
        url: kucoinConstant.future.positions,
        isKucoinFuture: true,
        kuCoinUserExchange: userExchange,
    })
        .then(res => res.data)
}

function getFutureActiveOrders({userExchange})
{
    return request.get({
        url: kucoinConstant.future.orders,
        isKucoinFuture: true,
        kuCoinUserExchange: userExchange,
    })
        .then(res => res.data)
}

function createFutureOrder({userExchange, order: {clientOid, side, pair, leverage, stop, stopPrice, price, size}})
{
    const symbol = pair.replace("/", "").replace("BTC", "XBT").replace("USDT", "USDTM")
    return request.post({
        url: kucoinConstant.future.order,
        isKucoinFuture: true,
        kuCoinUserExchange: userExchange,
        data: {
            remark: "coinjet bot added this",
            ...(stop && stopPrice ? {stopPriceType: "TP", stop, stopPrice} : {}),
            clientOid, side, symbol, leverage, price, size,
        },
    })
}

function startWebsocket()
{
    userFuturesSocket()
}

const kucoinController = {
    requestMiddleWareRes,
    getFutureAccountOverview,
    getFuturePositions,
    getFutureActiveOrders,
    createFutureOrder,
    startWebsocket,
}

export default kucoinController