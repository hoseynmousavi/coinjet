import axios from "axios"
import data from "../data"

function rootRouter(app)
{
    app.route("*")
        .post((req, res) =>
        {
            console.log("post: ", req.body)

            const {message} = req.body || {}
            const {message_id, from, chat, text} = message || {}
            if (message_id && from && chat && text)
            {

                const textBack = text.includes("سلام") || text.includes("hi") || text.includes("hello") ?
                    "سلام جیگر"
                    :
                    `کاملاً متوجه‌ام ${from.first_name} عزیز`

                axios.post(
                    `https://api.telegram.org/bot${data.token}/sendMessage`,
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

            res.send({message: "OK"})
        })
}

export default rootRouter