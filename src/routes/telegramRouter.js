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
                    const textBack = text.includes("سیگنال") && `گفتی سیگنال ${author_signature}؟ ایول`
                    if (textBack)
                    {
                        axios.post(
                            `${data.telegramApi}${data.telegramToken}/sendMessage`,
                            {
                                chat_id: chat.id,
                                text: textBack,
                                reply_to_message_id: message_id,
                                allow_sending_without_reply: true,
                            },
                        )
                            .then(() => console.log("sent"))
                            .catch(() => console.error("not sent"))
                    }
                }
            }

            res.send({message: "OK"})
        })
}

export default rootRouter