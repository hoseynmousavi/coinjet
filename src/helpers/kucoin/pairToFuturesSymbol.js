function pairToFuturesSymbol({pair})
{
    return pair.replace("/", "").replace("BTC", "XBT").replace("USDT", "USDTM")
}

export default pairToFuturesSymbol