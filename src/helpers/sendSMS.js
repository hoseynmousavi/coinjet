import axios from "axios"
import data from "../data"

function sendSMS({receptor, template, token})
{
    axios.get(`${data.kavenegarApi}${data.kavenegarKey}/verify/lookup.json?receptor=${receptor}&token=${token}&template=${template}`)
        .then(() => console.log("we tried for send sms"))
}

export default sendSMS