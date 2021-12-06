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

const kucoinController = {
    getAccounts,
}

export default kucoinController