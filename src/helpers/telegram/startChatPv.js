import exchangeController from "../../controllers/exchangeController"
import telegramConstant from "../../constants/telegramConstant"
import signUpUser from "../user/signUpUser"
import sendTelegramMessage from "./sendTelegramMessage"
import addExchangeTelegram from "./addExchangeTelegram"

function startChatPv({message_id, from, chat})
{
    const {first_name, last_name, username: telegram_username, id: telegram_id} = from
    const {id: telegram_chat_id} = chat
    signUpUser({telegram_id, first_name, last_name, telegram_username, telegram_chat_id})
        .then(() =>
        {
            sendTelegramMessage({chat_id: telegram_chat_id, text: telegramConstant.welcomeMsg})
            addExchangeTelegram({telegram_chat_id})
        })
}

export default startChatPv