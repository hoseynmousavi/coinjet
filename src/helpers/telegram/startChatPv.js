import telegramConstant from "../../constants/telegramConstant"
import signUpUser from "../user/signUpUser"
import sendTelegramMessage from "./sendTelegramMessage"
import promptAddExchangeTelegram from "./promptAddExchangeTelegram"

function startChatPv({first_name, last_name, telegram_username, telegram_id, telegram_chat_id})
{
    signUpUser({telegram_id, first_name, last_name, telegram_username, telegram_chat_id})
        .then(() =>
        {
            sendTelegramMessage({telegram_chat_id, text: telegramConstant.welcomeMsg})
            setTimeout(() => promptAddExchangeTelegram({telegram_chat_id}), 150)
        })
}

export default startChatPv