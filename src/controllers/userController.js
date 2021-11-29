import mongoose from "mongoose"
import userModel from "../models/userModel"

const userTb = mongoose.model("user", userModel)

function addUser(user)
{
    return new userTb(user).save()
}

function getUserByTelegramId({telegram_id})
{
    return userTb.findOne({telegram_id})
}

const userController = {
    addUser,
    getUserByTelegramId,
}

export default userController