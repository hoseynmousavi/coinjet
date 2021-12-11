import mongoose from "mongoose"
import exchangeModel from "../models/exchangeModel"
import checkPermission from "../helpers/checkPermission"

const exchangeTb = mongoose.model("exchange", exchangeModel)

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

const exchangeController = {
    addExchangeRes,
}

export default exchangeController