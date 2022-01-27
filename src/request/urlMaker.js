import data from "../data"

function urlMaker({isKuCoin, isKucoinFuture, isTelegram, url, param})
{
    return (isKuCoin ? data.kuCoinBase : isKucoinFuture ? data.kuCoinFutureBase : isTelegram ? data.telegramApi + data.telegramToken : "") +
        url +
        (param ? "/" + param : "")
}

export default urlMaker