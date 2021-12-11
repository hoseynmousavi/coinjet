import tokenHelper from "./tokenHelper"
import resConstant from "../constants/resConstant"

function checkPermission({req, res, minRole = "user"})
{
    return new Promise(resolve =>
    {
        tokenHelper.decodeToken(req?.headers?.authorization)
            .then(({password, _id, role}) =>
            {
                if (minRole === "user" || role === "admin") resolve({password, _id, role})
                else res.status(403).send({message: resConstant.dontHavePermission})
            })
            .catch(() => res.status(403).send({message: resConstant.dontHavePermission}))
    })
}

export default checkPermission