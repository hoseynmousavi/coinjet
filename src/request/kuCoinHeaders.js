import crypto from "crypto"
import data from "../data"

function kuCoinHeaders({userId, method, url, body})
{
    const timeStamp = Math.floor(new Date().getTime())
    const passPhrase = crypto.createHmac("sha256", data.kuCoinSecret).update(data.kuCoinPassphrase).digest("base64")
    const sign = crypto.createHmac("sha256", data.kuCoinSecret).update(timeStamp + method + url + body).digest("base64")
}

export default kuCoinHeaders