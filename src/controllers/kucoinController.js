import request from "../request/request"
import kucoinConstant from "../constants/kucoinConstant"
import userFuturesSocket from "../helpers/kucoin/userFuturesSocket"

function getFutureAccountOverview({userExchange})
{
    return request.get({
        url: kucoinConstant.future.accountOverview,
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
            remark: "coinjet bot added this", stopPriceType: "TP",
            clientOid, side, symbol, leverage, stop, stopPrice, price, size,
        },
    })
}

function startWebsocket()
{
    userFuturesSocket()
}

const kucoinController = {
    getFutureAccountOverview,
    createFutureOrder,
    startWebsocket,
}

export default kucoinController