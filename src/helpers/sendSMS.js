import axios from "axios"
import data from "../data/data"

function sendSMS({receptor, template, token})
{
    axios.get(`https://api.kavenegar.com/v1/${data.kavenegarKey}/verify/lookup.json?receptor=${receptor}&token=${token}&template=${template}`)
        .then(() => console.log("we tried for send sms"))
        .catch(err => console.log("error in sending sms", err))
}

export default sendSMS