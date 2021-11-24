import axios from "axios"
import data from "../data"
import request from "../request/request"
import telegramConstant from "../constants/telegramConstant"

function handlePvChat(message)
{
    const {message_id, from, chat, text} = message
    if (message_id && from && chat && text)
    {
        if (text === "/start")
        {
            console.log("got starts")
            request.post({
                isTelegram: true, url: telegramConstant.sendMessage,
                data: {
                    chat_id: chat.id,
                    text: telegramConstant.welcomeMsg,
                    reply_markup: {
                        keyboard: [{text: "kucoin"}],
                    },
                    // reply_to_message_id: message_id,
                    // allow_sending_without_reply: true,
                },
            })
                .then(res => console.log({res: res?.response?.data}))
                .catch(err => console.log({err: err?.response?.data}))
        }
        else
        {
            console.log("got shit")
        }
    }
}

const telegramController = {
    handlePvChat,
}

export default telegramController