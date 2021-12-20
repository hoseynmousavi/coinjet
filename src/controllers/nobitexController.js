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
                            const prices = {...pricesTemp.data, "RLS": 1 / usdtPrice}
                            const deposits = depositsTemp.filter(item => item.type === "واریز")
                            const withdraws = depositsTemp.filter(item => item.type === "برداشت")

                            console.log(depositsTemp)
                            console.log(deposits)
                            console.log(withdraws)

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
                            const allWithdraws = withdraws.reduce((sum, item) => sum + (item.currency.toUpperCase() === "USDT" ? +item.amount : item.currency.toUpperCase() === "RLS" ? +item.amount / usdtPrice : 0), 0)
                            const allDeposits = deposits.reduce((sum, item) => sum + (item.transaction.currency.toUpperCase() === "USDT" ? +item.transaction.amount : item.transaction.currency.toUpperCase() === "RLS" ? +item.transaction.amount / usdtPrice : 0), 0)
                            const allProfitOrShit = allBalance + allWithdraws - allDeposits
                            const allProfitOrShitPercent = (allBalance + allWithdraws) / allDeposits
                            const allProfitOrShitPercentTotal = allProfitOrShitPercent <= 1 ?
                                (1 - allProfitOrShitPercent) * 100
                                :
                                (allProfitOrShitPercent - 1) * 100

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

                        getTransactions({userExchange})
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

function getTransactions({userExchange})
{
    let page = 1
    let data = []

    function getData(resolve)
    {
        request.post({nobitexUserExchange: userExchange, url: nobitexConstant.transactionsHistory, data: {page}})
            .then(actionsRes =>
            {
                data = [...data, actionsRes.transactions]
                if (actionsRes.hasNext)
                {
                    page++
                    getData(resolve)
                }
                else resolve(data)
            })
    }

    return new Promise(resolve => getData(resolve))
}

const nobitexController = {
    getUserExchangeDataRes,
}

export default nobitexController