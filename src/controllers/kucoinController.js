import checkPermission from "../helpers/checkPermission"
import userExchangeController from "./userExchangeController"
import resConstant from "../constants/resConstant"
import request from "../request/request"
import kucoinConstant from "../constants/kucoinConstant"

function getUserExchangeDataRes(req, res)
{
    const {user_exchange_id} = req.params
    checkPermission({req, res})
        .then(({_id}) =>
        {
            userExchangeController.getUserExchanges({query: {user_id: _id, _id: user_exchange_id}})
                .then(userExchanges =>
                {
                    if (userExchanges.length === 1)
                    {
                        const userExchange = userExchanges[0].toJSON()
                        request.get({kuCoinUserExchange: userExchange, url: kucoinConstant.getAccounts})
                            .then(data =>
                            {
                                res.send(data)
                            })
                            .catch(err =>
                            {
                                console.log(err)
                                res.status(400).send({message: err})
                            })
                    }
                    else res.status(400).send({message: resConstant.noFound})
                })
        })
}

// const {user_id, url, method, data} = req.body || {}
// if (user_id && url && method)
// {
//     userExchangeController.getUserExchanges({user_id})
//         .then(userExchanges =>
//         {
//             request[method.toLowerCase() === "get" ? "get" : "post"]({url, kuCoinUserExchange: userExchanges[0], data})
//                 .then(result =>
//                 {
//                     res.send(result)
//                 })
//                 .catch(err =>
//                 {
//                     res.status(err?.response?.status || 500).send(err?.response?.data || {message: "we have err"})
//                 })
//         })
// }
// else res.status(400).send({message: "fields are incomplete."})

const kucoinController = {
    getUserExchangeDataRes,
}

export default kucoinController