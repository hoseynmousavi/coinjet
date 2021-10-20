import axios from "axios"
import urlMaker from "./urlMaker"
import kuCoinHeaders from "./kuCoinHeaders"

function get({isKuCoin, url, param = "", userId})
{
    return axios.get(urlMaker({isKuCoin, url, param}), {headers: isKuCoin && kuCoinHeaders({url, method: "GET", userId})})
        .then(res =>
        {
            return res.data
        })
        .catch(err =>
        {
            throw err
        })
}

function post({isKuCoin, url, param = "", data, userId})
{
    return axios.post(urlMaker({isKuCoin, url, param}), data, {headers: isKuCoin && kuCoinHeaders({url, method: "POST"})})
        .then(res =>
        {
            return res.data
        })
        .catch(err =>
        {
            throw err
        })
}

function put({isKuCoin, url, param = "", data, userId})
{
    return axios.put(urlMaker({isKuCoin, url, param}), data, {headers: isKuCoin && kuCoinHeaders(userId)})
        .then(res =>
        {
            return res.data
        })
        .catch(err =>
        {
            throw err
        })
}

function patch({isKuCoin, url, param = "", data, userId})
{
    return axios.patch(urlMaker({isKuCoin, url, param}), data, {headers: isKuCoin && kuCoinHeaders(userId)})
        .then(res =>
        {
            return res.data
        })
        .catch(err =>
        {
            throw err
        })
}

function del({isKuCoin, url, param = "", data, userId})
{
    return axios.delete(urlMaker({isKuCoin, url, param}), {headers: isKuCoin && kuCoinHeaders(userId), data})
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