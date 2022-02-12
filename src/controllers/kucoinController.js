import request from "../request/request"
import kucoinConstant from "../constants/kucoinConstant"
import userFuturesSocket from "../helpers/kucoin/userFuturesSocket"
import userExchangeController from "./userExchangeController"
import userExchangeConstant from "../constants/userExchangeConstant"
import orderController from "./orderController"

function requestMiddleWareRes(req, res)
{
    const {is_futures, user_id, url, method, data} = req.body || {}
    if (user_id && url && method)
    {
        userExchangeController.getUserExchangesByUserId({user_id, progress_level: userExchangeConstant.progress_level.complete})
            .then(userExchanges =>
            {
                console.log(userExchanges.filter(item => item.is_futures === is_futures))
                console.log(is_futures)
                request[method.toLowerCase() === "get" ? "get" : "post"]({url, isKucoinFuture: !!is_futures, kuCoinUserExchange: userExchanges.filter(item => item.is_futures === is_futures)[0], data})
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

function createFutureOrder({userExchange, order: {type, clientOid, side, symbol, leverage, stop, stopPrice, price, size}})
{
    request.post({
        url: kucoinConstant.future.order,
        isKucoinFuture: true,
        kuCoinUserExchange: userExchange,
        data: {
            remark: "coinjet bot added this",
            ...(stop && stopPrice ? {stopPriceType: "TP", stop, stopPrice} : {}),
            ...(price ? {price} : {}),
            type, clientOid, side, symbol, leverage, size,
        },
    })
        .then(res =>
        {
            if (res?.data?.orderId)
            {
                orderController.updateOrder({query: {_id: clientOid}, update: {exchange_order_id: res.data.orderId}})
            }
            else
            {
                orderController.removeOrder({order_id: clientOid})
            }
        })
        .catch(err =>
        {
            console.error({err: err?.response?.data})
            orderController.removeOrder({order_id: clientOid})
        })
}

function cancelFutureOrder({userExchange, exchange_order_id})
{
    request.del({
        url: kucoinConstant.future.cancelOrder(exchange_order_id),
        isKucoinFuture: true,
        kuCoinUserExchange: userExchange,
    })
        .then(res =>
        {
            if (res?.data?.cancelledOrderIds?.length)
            {
                orderController.updateOrder({query: {exchange_order_id}, update: {status: "canceled"}})
            }
        })
        .catch(err =>
        {
            console.error({err: err?.response?.data})
        })
}

function getFuturesActiveContracts()
{
    return request.get({
        url: kucoinConstant.future.activeContracts,
        isKucoinFuture: true,
    })
        .then(res => res.data)
}

function startWebsocket()
{
    userFuturesSocket.start()
}

function getSpotAccountOverview({userExchange, currency})
{
    return request.get({
        url: kucoinConstant.spot.getAccountOverview(currency),
        isKuCoin: true,
        kuCoinUserExchange: userExchange,
    })
        .then(res => res.data)
}

const kucoinController = {
    requestMiddleWareRes,
    getFutureAccountOverview,
    getFuturePositions,
    getFutureActiveOrders,
    createFutureOrder,
    startWebsocket,
    cancelFutureOrder,
    getFuturesActiveContracts,
    getSpotAccountOverview,
}

export default kucoinController