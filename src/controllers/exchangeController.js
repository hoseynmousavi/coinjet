import checkAdmin from "../helpers/checkAdmin"
import mongoose from "mongoose"
import exchangeModel from "../models/exchangeModel"

const exchangeTb = mongoose.model("exchange", exchangeModel)

function addExchange(req, res)
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

const exchangeController = {
    addExchange,
}

export default exchangeController