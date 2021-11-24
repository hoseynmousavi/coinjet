import data from "../data"

function urlMaker({isKuCoin, isTelegram, url, param})
{
    return (isKuCoin ? data.kuCoinBase : isTelegram ? data.telegramApi + data.telegramToken : "") + url + "/" + param
}

export default urlMaker