import mongoose from "mongoose"
import userModel from "../models/userModel"

const userTb = mongoose.model("user", userModel)

function addUser(user)
{
    return new userTb(user).save()
}

const userController = {
    addUser,
}

export default userController