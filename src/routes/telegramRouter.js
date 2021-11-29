import routeConstant from "../constants/routeConstant"
import data from "../data"
import axios from "axios"
import telegramController from "../controllers/telegramController"

function rootRouter(app)
{
    app.route(routeConstant.telegram)
        .post((req, res) =>
        {
            const {message, channel_post} = req.body || {}
            if (message) telegramController.handlePvChat(message)
            else if (channel_post)
            {
                const {message_id, author_signature, chat, text} = channel_post
                if (message_id && author_signature && chat && text)
                {

                }
            }
            res.send({message: "OK"})
        })
}

export default rootRouter