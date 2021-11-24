import crypto from "crypto"
import data from "../data"

function kuCoinHeaders({userExchange, method, url, body})
{
    const timeStamp = Math.floor(new Date().getTime())
    const passPhrase = crypto.createHmac("sha256", userExchange.user_key).update(userExchange.user_passphrase).digest("base64")
    const sign = crypto.createHmac("sha256", userExchange.user_secret).update(timeStamp + method + url + (body && Object.keys(body).length ? JSON.stringify(body) : "")).digest("base64")
    return {
        "KC-API-KEY": userExchange.user_key,
        "KC-API-SIGN": sign,
        "KC-API-TIMESTAMP": timeStamp,
        "KC-API-PASSPHRASE": passPhrase,
        "KC-API-KEY-VERSION": data.kuCoinApiVersion,
    }
}

export default kuCoinHeaders