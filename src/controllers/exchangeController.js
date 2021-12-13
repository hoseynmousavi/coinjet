import mongoose from "mongoose"
import exchangeModel from "../models/exchangeModel"
import checkPermission from "../helpers/checkPermission"

const exchangeTb = mongoose.model("exchange", exchangeModel)

function getExchanges({query, projection, options})
{
    return exchangeTb.find(query, projection, options)
}

function addExchangeRes(req, res)
{
    checkPermission({req, res, minRole: "admin"})
        .then(() =>
        {
            new exchangeTb(req.body).save((err, created) =>
            {
                if (err) res.status(400).send({message: err})
                else res.send({created})
            })
        })
}

function getExchangesRes(req, res)
{
    getExchanges({})
        .then((exchanges, err) =>
        {
            if (err) res.status(500).send({message: err})
            else res.send(exchanges)
        })
}

const exchangeController = {
    addExchangeRes,
    getExchangesRes,
}

export default exchangeController