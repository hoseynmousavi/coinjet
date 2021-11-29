import checkAdmin from "../helpers/checkAdmin"
import mongoose from "mongoose"
import exchangeModel from "../models/exchangeModel"

const exchangeTb = mongoose.model("exchange", exchangeModel)

let exchanges = []

getExchanges().then(allExchanges =>
{
    if (allExchanges?.length) exchanges = allExchanges
})

function addExchangeRes(req, res)
{
    if (checkAdmin(req, res))
    {
        new exchangeTb(req.body).save((err, created) =>
        {
            if (err) res.status(400).send({message: err})
            else res.send({created})
        })
    }
}

function getExchanges()
{
    if (exchanges?.length) return new Promise(resolve => resolve(exchanges))
    else return exchangeTb.find()
}

const exchangeController = {
    addExchangeRes,
    getExchanges,
}

export default exchangeController