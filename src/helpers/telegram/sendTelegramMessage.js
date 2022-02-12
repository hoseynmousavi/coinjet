import request from "../../request/request"
import telegramEndpoints from "../../constants/telegramEndpoints"

function sendTelegramMessage({telegram_chat_id, text, reply_buttons, reply_to_message_id})
{
    request.post({
        isTelegram: true,
        url: telegramEndpoints.sendMessage,
        data: {
            chat_id: telegram_chat_id,
            text,
            reply_markup: reply_buttons?.length ? {keyboard: [reply_buttons], one_time_keyboard: true, resize_keyboard: true} : {remove_keyboard: true},
            reply_to_message_id,
            allow_sending_without_reply: true,
        },
    })
        .catch(err => console.log({err: err?.response?.data}))
}

export default sendTelegramMessage