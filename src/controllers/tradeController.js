import axios from "axios"
import crypto from "crypto"
import data from "../data"
import e from "express"

function getUser(req, res)
{
    const sendBody = {...req.body}
    delete sendBody.api
    delete sendBody.method
    const body = Object.keys(sendBody).length ? JSON.stringify(sendBody) : ""
    const base = "https://api.kucoin.com"
    const api = req.body.api
    const method = req.body.method.toUpperCase()

    const timeStamp = Math.floor(new Date().getTime())
    const passPhrase = crypto.createHmac("sha256", data.kuCoinSecret).update(data.kuCoinPassphrase).digest("base64")
    const sign = crypto.createHmac("sha256", data.kuCoinSecret).update(timeStamp + method + api + body).digest("base64")

    if (method === "GET")
    {
        axios.get(
            base + api,
            {
                params: sendBody,
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
    else
    {
        axios.post(
            base + api,
            sendBody,
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
}

const tradeController = {
    getUser,
}

export default tradeController