import mongoose from "mongoose"
import userExchangeModel from "../models/userExchangeModel"
import checkPermission from "../helpers/checkPermission"

const userExchangeTb = mongoose.model("user-exchange", userExchangeModel)

function getUserExchanges({query, projection, options})
{
    return userExchangeTb.find(query, projection, options)
}

function addUserExchanges(userExchange)
{
    return new userExchangeTb(userExchange).save()
}

function getUserExchangesRes(req, res)
{
    checkPermission({req, res})
        .then(({_id}) =>
        {
            getUserExchanges({query: {user_id: _id}})
                .then(userExchanges => res.send(userExchanges))
        })
}

function addUserExchangesRes(req, res)
{
    checkPermission({req, res})
        .then(({_id}) =>
        {
            const {exchange_id, name, user_key, user_secret, user_passphrase} = req.body
            addUserExchanges({user_id: _id, exchange_id, name, user_key, user_secret, user_passphrase})
                .then(addedUserExchange => res.send(addedUserExchange))
                .catch(err => res.status(400).send({message: err}))
        })
}

const userExchangeController = {
    getUserExchangesRes,
    addUserExchangesRes,
}

export default userExchangeController