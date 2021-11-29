import exchangeController from "../../controllers/exchangeController"
import request from "../../request/request"
import telegramConstant from "../../constants/telegramConstant"
import signUpUser from "../user/signUpUser"

function startChat({message_id, from, chat, text})
{
    const {first_name, last_name, username: telegram_username, id: telegram_id, is_bot} = from
    if (!is_bot)
    {
        signUpUser({first_name, last_name, telegram_username, telegram_id})
            .then(() =>
            {
                exchangeController.getExchanges().then((exchanges, err) =>
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
            })
    }
}

export default startChat