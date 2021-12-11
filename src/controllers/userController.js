import mongoose from "mongoose"
import userModel from "../models/userModel"
import resConstant from "../constants/resConstant"
import sendUserData from "../helpers/user/sendUserData"

const userTb = mongoose.model("user", userModel)

function addUser(user)
{
    return new userTb(user).save()
}

function findOneUser({query, projection, options})
{
    return userTb.findOne(query, projection, options)
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

const userController = {
    signupRes,
    loginRes,
}

export default userController