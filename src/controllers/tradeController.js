import axios from "axios"
import crypto from "crypto"
import data from "../data"
import e from "express"

function getUser(req, res)
{
    const base = "https://api.kucoin.com"
    const api = "/api/v1/sub/user"

    const timeStamp = Math.floor(new Date().getTime())
    console.log(timeStamp)
    const passPhrase = crypto.createHmac("sha256", data.kuCoinSecret).update(data.kuCoinPassphrase).digest("base64")
    const sign = crypto.createHmac("sha256", data.kuCoinSecret).update(timeStamp + "GET" + api + "").digest("base64")

    axios.get(
        base + api,
        {
            headers: {
                "KC-API-KEY": data.kuCoinKey,
                "KC-API-SIGN": sign,
                "KC-API-TIMESTAMP": timeStamp,
                "KC-API-PASSPHRASE": passPhrase,
                "KC-API-KEY-VERSION": data.kuCoinApiVersion,
            },
        },
    )
        .then(respond =>
        {
            console.log("respond", respond)
            res.status(200).send({message: "yes"})
        })
        .catch(err =>
        {
            console.log(err.response.data)
            res.status(500).send({message: "nope"})
        })
}

const tradeController = {
    getUser,
}

export default tradeController