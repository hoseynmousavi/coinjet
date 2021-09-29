import axios from "axios"
import crypto from "crypto"
import data from "../data"
import e from "express"

function getUser(req, res)
{
    const sendBody = {...req.body}
    delete sendBody.base
    delete sendBody.api
    delete sendBody.method

    console.log(sendBody)

    const body = Object.keys(sendBody).length ? JSON.stringify(sendBody) : ""
    const base = req.body.base === "future" ? "https://api-futures.kucoin.com" : "https://api.kucoin.com"
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
                res.status(200).send({message: respond?.data})
            })
            .catch(err =>
            {
                res.status(500).send({message: err?.response?.data})
            })
    }
    else if (method === "POST")
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
                res.status(200).send({message: respond?.data})
            })
            .catch(err =>
            {
                res.status(500).send({message: err?.response?.data})
            })
    }
    else if (method === "DELETE")
    {
        axios.delete(
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
                res.status(200).send({message: respond?.data})
            })
            .catch(err =>
            {
                res.status(500).send({message: err?.response?.data})
            })
    }
}

const tradeController = {
    getUser,
}

export default tradeController