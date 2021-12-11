import tokenHelper from "../tokenHelper"
import resConstant from "../../constants/resConstant"

function sendUserData({user, res})
{
    if (user)
    {
        const userJson = user.toJSON()
        tokenHelper.encodeToken({_id: userJson._id, password: userJson.password, role: userJson.role})
            .then(token =>
            {
                const sendingUser = {...userJson, token}
                delete sendingUser.password
                res.send(sendingUser)
            })
    }
    else res.status(404).send({message: resConstant.noUserFound})
}

export default sendUserData