import checkPermission from "../helpers/checkPermission"
import userExchangeController from "./userExchangeController"
import resConstant from "../constants/resConstant"
import request from "../request/request"
import kucoinConstant from "../constants/kucoinConstant"
import nobitexConstant from "../constants/nobitexConstant"

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
                        request.post({nobitexUserExchange: userExchange, url: nobitexConstant.getAccounts})
                            .then(accounts =>
                            {
                                request.post({nobitexUserExchange: userExchange, url: nobitexConstant.deposits})
                                    .then(deposits =>
                                    {
                                        request.get({url: kucoinConstant.prices})
                                            .then(prices =>
                                            {
                                                res.send({accounts, prices, deposits})
                                            })
                                    })
                            })
                            .catch(err =>
                            {
                                console.log(err)
                                res.status(400).send({message: resConstant.incorrectData})
                            })
                    }
                    else res.status(400).send({message: resConstant.noFound})
                })
        })
}

const nobitexController = {
    getUserExchangeDataRes,
}

export default nobitexController