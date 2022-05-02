import request from "../request/request"
import kucoinConstant from "../constants/kucoinConstant"
import userFuturesSocket from "../helpers/kucoin/userFuturesSocket"
import userExchangeController from "./userExchangeController"
import userExchangeConstant from "../constants/userExchangeConstant"
import orderController from "./orderController"
import userSpotSocket from "../helpers/kucoin/userSpotSocket"

function requestMiddleWareRes(req, res)
{
    const {is_futures, user_id, url, method, data} = req.body || {}
    if (user_id && url && method)
    {
        userExchangeController.getUserExchangesByUserId({user_id, progress_level: userExchangeConstant.progress_level.complete})
            .then(userExchanges =>
            {
                request[method.toLowerCase() === "get" ? "get" : "post"]({url, isKuCoin: !is_futures, isKucoinFuture: !!is_futures, kuCoinUserExchange: userExchanges.filter(item => item.is_futures === !!is_futures)[0], data})
                    .then(result =>
                    {
                        res.send(result)
                    })
                    .catch(err =>
                    {
                        console.log(err)
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
    return new Promise((resolve, reject) =>
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
                    resolve()
                }
                else
                {
                    const error = res
                    console.error({error})
                    reject("ارور سرور")
                    orderController.removeOrder({order_id: clientOid})
                }
            })
            .catch(err =>
            {
                const error = err?.response
                console.error({error})
                if (+error.code === 429000) setTimeout(() => createFutureOrder(arguments[0]), 100)
                else
                {
                    reject(error.msg)
                    orderController.removeOrder({order_id: clientOid})
                }
            })
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

function getSpotSymbols()
{
    return request.get({
        url: kucoinConstant.spot.symbols,
        isKuCoin: true,
    })
        .then(res => res.data)
}

function startFuturesWebsocket()
{
    userFuturesSocket.start()
}

function getSpotAccountOverview({userExchange, currency, type})
{
    return request.get({
        url: kucoinConstant.spot.getAccountOverview({currency, type}),
        isKuCoin: true,
        kuCoinUserExchange: userExchange,
    })
        .then(res => res.data)
}

function createSpotOrder({userExchange, order: {type, clientOid, side, symbol, stop, stopPrice, price, size}})
{
    return new Promise((resolve, reject) =>
    {
        const isStop = stop && stopPrice
        request.post({
            url: isStop ? kucoinConstant.spot.stopOrder : kucoinConstant.spot.order,
            isKuCoin: true,
            kuCoinUserExchange: userExchange,
            data: {
                remark: "coinjet bot added this",
                ...(stop && stopPrice ? {stop, stopPrice} : {}),
                ...(price ? {price} : {}),
                type, clientOid, side, symbol, size,
            },
        })
            .then(res =>
            {
                if (res?.data?.orderId)
                {
                    orderController.updateOrder({query: {_id: clientOid}, update: {exchange_order_id: res.data.orderId}})
                    resolve()
                }
                else
                {
                    const error = res
                    console.error({error})
                    reject("ارور سرور")
                    orderController.removeOrder({order_id: clientOid})
                }
            })
            .catch(err =>
            {
                const error = err?.response
                console.error({error})
                if (+error.code === 429000) setTimeout(() => createSpotOrder(arguments[0]), 100)
                else
                {
                    reject(error.msg)
                    orderController.removeOrder({order_id: clientOid})
                }
            })
    })
}

function startSpotWebsocket()
{
    userSpotSocket.start()
}

function cancelSpotOrder({userExchange, exchange_order_id, isStop})
{
    request.del({
        url: isStop ? kucoinConstant.spot.cancelStopOrder(exchange_order_id) : kucoinConstant.spot.cancelOrder(exchange_order_id),
        isKuCoin: true,
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

const kucoinController = {
    requestMiddleWareRes,
    getFutureAccountOverview,
    getFuturePositions,
    getFutureActiveOrders,
    createFutureOrder,
    startFuturesWebsocket,
    cancelFutureOrder,
    getFuturesActiveContracts,
    getSpotSymbols,
    getSpotAccountOverview,
    createSpotOrder,
    startSpotWebsocket,
    cancelSpotOrder,
}

export default kucoinController