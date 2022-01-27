import request from "../request/request"
import kucoinConstant from "../constants/kucoinConstant"
import userExchangeController from "./userExchangeController"

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

function getFutureAccountOverview({userExchange})
{
    return request.get({
        url: kucoinConstant.future.accountOverview,
        kuCoinUserExchange: userExchange,
    })
}

const kucoinController = {
    requestMiddleWareRes,
    getFutureAccountOverview,
}

export default kucoinController