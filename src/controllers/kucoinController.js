import request from "../request/request"
import kucoinConstant from "../constants/kucoinConstant"
import userExchangeController from "./userExchangeController"

function getAccounts()
{
    return userExchangeController.getUserExchangesByUserId({user_id: "617023d65d331d7b572160d4", progress_level: "complete"})
        .then(userExchanges =>
        {
            return request.get({url: kucoinConstant.getAccounts, kuCoinUserExchange: userExchanges[0]})
                .then(res => res)
                .catch(err =>
                {
                    throw err
                })
        })
}

function requestMiddleWareRes(req, res)
{
    const {user_id, url, method, data} = req.body || {}
    if (user_id && url && method)
    {
        userExchangeController.getUserExchangesByUserId({user_id, progress_level: "complete"})
            .then(userExchanges =>
            {
                request[method.toLowerCase() === "get" ? "get" : "post"]({url, kuCoinUserExchange: userExchanges[0], data})
                    .then(result =>
                    {
                        res.send(result)
                    })
                    .catch(err =>
                    {
                        res.status(err?.response?.status || 500).send(err?.response?.data || {message: "we have err"})
                    })
            })
    }
    else res.status(400).send({message: "fields are incomplete."})
}

const kucoinController = {
    requestMiddleWareRes,
}

export default kucoinController