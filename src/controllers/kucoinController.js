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
                            .then(accountsRes =>
                            {
                                request.get({kuCoinUserExchange: userExchange, url: kucoinConstant.prices})
                                    .then(pricesRes =>
                                    {
                                        request.get({kuCoinUserExchange: userExchange, url: kucoinConstant.deposits})
                                            .then(depositsRes =>
                                            {
                                                request.get({kuCoinUserExchange: userExchange, url: kucoinConstant.withdrawals})
                                                    .then(withdrawalsRes =>
                                                    {
                                                        const accountsArr = accountsRes.data
                                                        const prices = pricesRes.data
                                                        const deposits = depositsRes.data.items
                                                        const withdrawals = withdrawalsRes.data.items

                                                        let accounts = {}

                                                        for (let i = 0; i < accountsArr.length; i++)
                                                        {
                                                            const item = accountsArr[i]
                                                            if (item.balance > 0)
                                                            {
                                                                if (accounts[item.currency]) accounts[item.currency].balance += +item.balance
                                                                else accounts[item.currency] = {currency: item.currency, balance: +item.balance}
                                                            }
                                                        }

                                                        Object.values(accounts).forEach(item => item.valueInUSDT = item.balance * (+prices[item.currency]))

                                                        accounts = Object.values(accounts).sort((a, b) => b.valueInUSDT - a.valueInUSDT)

                                                        const allBalance = accounts.reduce((sum, item) => sum + item.valueInUSDT, 0)
                                                        const allWithdrawals = withdrawals.reduce((sum, item) => sum + (item.currency === "USDT" ? +item.amount : 0), 0)
                                                        const allDeposits = deposits.reduce((sum, item) => sum + (item.currency === "USDT" ? +item.amount : 0), 0)
                                                        const allProfitOrShit = allBalance + allWithdrawals - allDeposits
                                                        const allProfitOrShitPercent = (allBalance + allWithdrawals) / allDeposits
                                                        const allProfitOrShitPercentTotal = allProfitOrShitPercent <= 1 ? (1 - allProfitOrShitPercent) * 100 : allProfitOrShitPercent * 100

                                                        res.send({accounts, prices, allProfitOrShit, allProfitOrShitPercentTotal})
                                                    })
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

const kucoinController = {
    getUserExchangeDataRes,
}

export default kucoinController