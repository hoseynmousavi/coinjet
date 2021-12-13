import checkPermission from "../helpers/checkPermission"
import userExchangeController from "./userExchangeController"
import resConstant from "../constants/resConstant"
import request from "../request/request"
import kucoinConstant from "../constants/kucoinConstant"
import nobitexConstant from "../constants/nobitexConstant"
import data from "../data"

function getUserExchangeDataRes(req, res)
{
    const {user_exchange_id} = req.params
    checkPermission({req, res})
        .then(({_id}) =>
        {
            userExchangeController.getUserExchanges({query: {user_id: _id, _id: user_exchange_id}})
                .then(userExchanges =>
                {
                    let accountsTemp = null
                    let pricesTemp = null
                    let depositsTemp = null
                    let usdtPrice = null

                    function sendRes()
                    {
                        if (accountsTemp && pricesTemp && depositsTemp && usdtPrice)
                        {
                            const accountsArr = accountsTemp.wallets
                            const prices = {...pricesTemp.data, "RLS": usdtPrice}
                            const deposits = depositsTemp.deposits
                            const withdrawals = depositsTemp.withdrawals

                            let accounts = {}

                            for (let i = 0; i < accountsArr.length; i++)
                            {
                                const item = accountsArr[i]
                                if (item.balance > 0)
                                {
                                    if (accounts[item.currency.toUpperCase()]) accounts[item.currency.toUpperCase()].balance += +item.balance
                                    else accounts[item.currency.toUpperCase()] = {currency: item.currency.toUpperCase(), balance: +item.balance}
                                }
                            }

                            Object.values(accounts).forEach(item => item.valueInUSDT = item.balance * (+prices[item.currency.toUpperCase()]))

                            accounts = Object.values(accounts).sort((a, b) => b.valueInUSDT - a.valueInUSDT)

                            const allBalance = accounts.reduce((sum, item) => sum + item.valueInUSDT, 0)
                            const allWithdrawals = withdrawals.reduce((sum, item) => sum + (item.currency.toUpperCase() === "USDT" ? +item.amount : 0), 0)
                            const allDeposits = deposits.reduce((sum, item) => sum + (item.transaction.currency.toUpperCase() === "USDT" ? +item.transaction.amount : 0), 0)
                            const allProfitOrShit = allBalance + allWithdrawals - allDeposits
                            const allProfitOrShitPercent = (allBalance + allWithdrawals) / allDeposits
                            const allProfitOrShitPercentTotal = allProfitOrShitPercent <= 1 ? (1 - allProfitOrShitPercent) * 100 : allProfitOrShitPercent * 100

                            res.send({accounts, prices, allBalance, allProfitOrShit, allProfitOrShitPercentTotal})
                        }
                    }

                    if (userExchanges.length === 1)
                    {
                        const userExchange = userExchanges[0].toJSON()
                        request.get({nobitexUserExchange: userExchange, url: nobitexConstant.getAccounts})
                            .then(accountsRes =>
                            {
                                accountsTemp = accountsRes
                                sendRes()
                            })
                            .catch(err =>
                            {
                                console.log(err?.response?.data)
                                res.status(400).send({message: resConstant.incorrectData})
                            })

                        request.get({url: nobitexConstant.usdtPrice})
                            .then(usdtPriceRes =>
                            {
                                usdtPrice = usdtPriceRes.stats["usdt-rls"].bestSell
                                sendRes()
                            })

                        request.get({kuCoinUserExchange: {user_key: data.myKucoinUserKey, user_passphrase: data.myKucoinPass, user_secret: data.myKucoinSecret}, url: kucoinConstant.prices})
                            .then(pricesRes =>
                            {
                                pricesTemp = pricesRes
                                sendRes()
                            })

                        request.get({nobitexUserExchange: userExchange, url: nobitexConstant.deposits})
                            .then(depositsRes =>
                            {
                                depositsTemp = depositsRes
                                sendRes()
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