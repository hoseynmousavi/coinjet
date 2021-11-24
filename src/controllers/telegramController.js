import axios from "axios"
import data from "../data"
import request from "../request/request"
import telegramConstant from "../constants/telegramConstant"
import exchangeController from "./exchangeController"

function handlePvChat(message)
{
    const {message_id, from, chat, text} = message
    if (message_id && from && chat && text)
    {
        if (text === "/start")
        {
            exchangeController.getExchangesHelper().then((exchanges, err) =>
            {
                if (err) console.log("have err:", err)
                else
                {
                    request.post({
                        isTelegram: true, url: telegramConstant.sendMessage,
                        data: {
                            chat_id: chat.id,
                            text: telegramConstant.welcomeMsg,
                        },
                    })
                        .then(res => console.log({res: res?.data}))
                        .catch(err => console.log({err: err?.response?.data}))

                    request.post({
                        isTelegram: true, url: telegramConstant.sendMessage,
                        data: {
                            chat_id: chat.id,
                            text: telegramConstant.chooseExchanges,
                            reply_markup: {keyboard: [exchanges.map(item => ({text: item.name}))], one_time_keyboard: true, resize_keyboard: true},
                            // reply_to_message_id: message_id,
                            // allow_sending_without_reply: true,
                        },
                    })
                        .then(res => console.log({res: res?.data}))
                        .catch(err => console.log({err: err?.response?.data}))
                }
            })
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