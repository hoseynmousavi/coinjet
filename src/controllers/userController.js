import mongoose from "mongoose"
import userModel from "../models/userModel"
import tokenHelper from "../helpers/tokenHelper"

const userTb = mongoose.model("user", userModel)

function addUser(user)
{
    return new userTb(user).save()
}

function findOneUser({query, projection, options})
{
    return userTb.findOne(query, projection, options)
}

function getUserByTelegramId({telegram_id})
{
    return userTb.findOne({telegram_id})
}

function updateUserByTelegramId({telegram_id, update})
{
    return userTb.updateOne({telegram_id}, update)
}

function signupRes(req, res)
{
    const data = {...req.body, role: "user"}
    addUser(data)
        .then(user => sendUserData({user, res}))
        .catch(err => res.status(400).send({massage: err}))
}

function loginRes(req, res)
{
    const {email, password} = req.body
    if (email && password)
    {
        findOneUser({query: {email, password}})
            .then(user => sendUserData({user, res}))
            .catch(err => res.status(400).send({massage: err}))
    }
}

function sendUserData({user, res})
{
    if (user)
    {
        tokenHelper.encodeToken({_id: user._id, password: user.password})
            .then(token =>
            {
                const sendingUser = {...user, token}
                delete sendingUser.password
                res.send(sendingUser)
            })
    }
    else res.status(404).send({message: "اکانتی با اطلاعات ارسال شده یافت نشد."})
}

const userController = {
    addUser,
    getUserByTelegramId,
    updateUserByTelegramId,
    signupRes,
    loginRes,
}

export default userController