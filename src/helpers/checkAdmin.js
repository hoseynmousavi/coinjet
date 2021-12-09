import data from "../data"
import resConstant from "../constants/resConstant"

function checkAdmin(req, res)
{
    if (req?.headers?.authorization === data.adminToken) return true
    else
    {
        res.status(403).send({message: resConstant.dontHavePermission})
        return false
    }
}

export default checkAdmin