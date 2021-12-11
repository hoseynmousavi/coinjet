function getUserExchangeDataRes(req, res)
{
    console.log(req.params)
    // const {user_exchange_id} = req.params
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