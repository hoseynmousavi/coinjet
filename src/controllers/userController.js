import mongoose from "mongoose"
import userModel from "../models/userModel"
import tokenHelper from "../helpers/tokenHelper"
import resConstant from "../constants/resConstant"

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
        .catch(err =>
        {
            if (err?.keyPattern?.email) res.status(400).send({message: resConstant.alreadyExists})
            else res.status(400).send({message: err})
        })
}

function loginRes(req, res)
{
    const {email, password} = req.body
    if (email && password)
    {
        findOneUser({query: {email, password}})
            .then(user => sendUserData({user, res}))
            .catch(err => res.status(400).send({message: err}))
    }
}

function sendUserData({user, res})
{
    if (user)
    {
        const userJson = user.toJSON()
        tokenHelper.encodeToken({_id: userJson._id, password: userJson.password})
            .then(token =>
            {
                const sendingUser = {...userJson, token}
                delete sendingUser.password
                res.send(sendingUser)
            })
    }
    else res.status(404).send({message: resConstant.noUserFound})
}

const userController = {
    addUser,
    getUserByTelegramId,
    updateUserByTelegramId,
    signupRes,
    loginRes,
}

export default userController