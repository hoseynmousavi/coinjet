import data from "../data"

function urlMaker({isKuCoin, url, param})
{
    return (isKuCoin && data.kuCoinBase) + url + "/" + param
}

export default urlMaker