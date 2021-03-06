import axios from "axios"
import urlMaker from "./urlMaker"
import kuCoinHeaders from "./kuCoinHeaders"

function get({kuCoinUserExchange, isKuCoin, isKucoinFuture, isTelegram, url, param = ""})
{
    return axios.get(
        urlMaker({isKuCoin, isKucoinFuture, isTelegram, url, param}),
        {headers: kuCoinUserExchange && kuCoinHeaders({url, method: "GET", userExchange: kuCoinUserExchange})},
    )
        .then(res =>
        {
            return res.data
        })
        .catch(err =>
        {
            throw err
        })
}

function post({kuCoinUserExchange, isKuCoin, isKucoinFuture, isTelegram, url, param = "", data})
{
    return axios.post(
        urlMaker({isKuCoin, isKucoinFuture, isTelegram, url, param}),
        data,
        {headers: kuCoinUserExchange && kuCoinHeaders({url, method: "POST", userExchange: kuCoinUserExchange, body: data})},
    )
        .then(res =>
        {
            return res.data
        })
        .catch(err =>
        {
            throw err
        })
}

function put({kuCoinUserExchange, isKuCoin, isKucoinFuture, isTelegram, url, param = "", data})
{
    return axios.put(
        urlMaker({isKuCoin, isKucoinFuture, isTelegram, url, param}),
        data,
        {headers: kuCoinUserExchange && kuCoinHeaders({url, method: "PUT", userExchange: kuCoinUserExchange, body: data})},
    )
        .then(res =>
        {
            return res.data
        })
        .catch(err =>
        {
            throw err
        })
}

function patch({kuCoinUserExchange, isKuCoin, isKucoinFuture, isTelegram, url, param = "", data})
{
    return axios.patch(
        urlMaker({isKuCoin, isKucoinFuture, isTelegram, url, param}),
        data,
        {headers: kuCoinUserExchange && kuCoinHeaders({url, method: "PATCH", userExchange: kuCoinUserExchange, body: data})},
    )
        .then(res =>
        {
            return res.data
        })
        .catch(err =>
        {
            throw err
        })
}

function del({kuCoinUserExchange, isKuCoin, isKucoinFuture, isTelegram, url, param = "", data})
{
    return axios.delete(
        urlMaker({isKuCoin, isKucoinFuture, isTelegram, url, param}),
        {
            headers: kuCoinUserExchange && kuCoinHeaders({url, method: "DELETE", userExchange: kuCoinUserExchange, body: data}),
            data,
        },
    )
        .then(res =>
        {
            return res.data
        })
        .catch(err =>
        {
            throw err
        })
}

const request = {
    get, post, put, patch, del,
}

export default request