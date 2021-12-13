import data from "../data"

function urlMaker({isKuCoin, isTelegram, url, param})
{
    return (isKuCoin ? data.kuCoinBase : isTelegram ? data.telegramApi + data.telegramToken : data.nobitexBase) + url + (param ? "/" + param : "")
}

export default urlMaker