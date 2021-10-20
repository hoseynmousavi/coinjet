import data from "../data"

function checkAdmin(req, res)
{
    if (req?.headers?.authorization === data.adminToken) return true
    else
    {
        res.status(403).send({message: "شما پرمیشن لازم را ندارید."})
        return false
    }
}

export default checkAdmin