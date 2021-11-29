import checkAdmin from "../helpers/checkAdmin"
import mongoose from "mongoose"
import exchangeModel from "../models/exchangeModel"

const exchangeTb = mongoose.model("exchange", exchangeModel)

let exchanges = []

function loadExchangesToMemory()
{
    getExchanges().then(allExchanges =>
    {
        if (allExchanges?.length) exchanges = allExchanges
    })
}

loadExchangesToMemory()

function getExchangesInstantly()
{
    if (exchanges?.length) return exchanges
    else return []
}

function getExchanges()
{
    const exchanges = getExchangesInstantly()
    if (exchanges?.length) return new Promise(resolve => resolve(exchanges))
    else return exchangeTb.find()
}

function addExchangeRes(req, res)
{
    if (checkAdmin(req, res))
    {
        new exchangeTb(req.body).save((err, created) =>
        {
            if (err) res.status(400).send({message: err})
            else
            {
                res.send({created})
                loadExchangesToMemory()
            }
        })
    }
}

const exchangeController = {
    addExchangeRes,
    getExchanges,
    getExchangesInstantly,
}

export default exchangeController