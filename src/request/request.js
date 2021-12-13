import axios from "axios"
import urlMaker from "./urlMaker"
import kuCoinHeaders from "./kuCoinHeaders"
import nobitexHeaders from "./nobitexHeaders"

function get({kuCoinUserExchange, nobitexUserExchange, isTelegram, url, param = ""})
{
    return axios.get(
        urlMaker({isKuCoin: !!kuCoinUserExchange, isTelegram, url, param}),
        {
            headers: kuCoinUserExchange ?
                kuCoinHeaders({url, method: "GET", userExchange: kuCoinUserExchange})
                :
                nobitexUserExchange && nobitexHeaders({userExchange: nobitexUserExchange}),
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

function post({kuCoinUserExchange, nobitexUserExchange, isTelegram, url, param = "", data})
{
    return axios.post(
        urlMaker({isKuCoin: !!kuCoinUserExchange, isTelegram, url, param}),
        data,
        {
            headers: kuCoinUserExchange ?
                kuCoinHeaders({url, method: "POST", userExchange: kuCoinUserExchange, body: data})
                :
                nobitexUserExchange && nobitexHeaders({userExchange: nobitexUserExchange}),
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

function put({kuCoinUserExchange, nobitexUserExchange, isTelegram, url, param = "", data})
{
    return axios.put(
        urlMaker({isKuCoin: !!kuCoinUserExchange, isTelegram, url, param}),
        data,
        {
            headers: kuCoinUserExchange ?
                kuCoinHeaders({url, method: "PUT", userExchange: kuCoinUserExchange, body: data})
                :
                nobitexUserExchange && nobitexHeaders({userExchange: nobitexUserExchange}),
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

function patch({kuCoinUserExchange, nobitexUserExchange, isTelegram, url, param = "", data})
{
    return axios.patch(
        urlMaker({isKuCoin: !!kuCoinUserExchange, isTelegram, url, param}),
        data,
        {
            headers: kuCoinUserExchange ?
                kuCoinHeaders({url, method: "PATCH", userExchange: kuCoinUserExchange, body: data})
                :
                nobitexUserExchange && nobitexHeaders({userExchange: nobitexUserExchange}),
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

function del({kuCoinUserExchange, nobitexUserExchange, isTelegram, url, param = "", data})
{
    return axios.delete(
        urlMaker({isKuCoin: !!kuCoinUserExchange, isTelegram, url, param}),
        {
            headers: kuCoinUserExchange ?
                kuCoinHeaders({url, method: "DELETE", userExchange: kuCoinUserExchange, body: data})
                :
                nobitexUserExchange && nobitexHeaders({userExchange: nobitexUserExchange}),
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