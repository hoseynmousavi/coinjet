import startChatPv from "../helpers/telegram/startChatPv"
import exchangeController from "./exchangeController"
import sendTelegramMessage from "../helpers/telegram/sendTelegramMessage"
import telegramConstant from "../constants/telegramConstant"
import telegramCommands from "../constants/telegramCommands"
import promptAddExchangeTelegram from "../helpers/telegram/promptAddExchangeTelegram"
import promptRemoveExchangeTelegram from "../helpers/telegram/promptRemoveExchangeTelegram"
import addUserExchangeInProgress from "../helpers/telegram/addUserExchangeInProgress"
import addUserExchangeCompletely from "../helpers/telegram/addUserExchangeCompletely"
import removeExchangeTelegram from "../helpers/telegram/removeExchangeTelegram"

function handlePvChat(message)
{
    const {message_id, from, chat, text} = message
    const {is_bot, first_name, last_name, username: telegram_username, id: telegram_id} = from
    const {type, id: telegram_chat_id} = chat
    if (message_id && from && chat && text)
    {
        if (!is_bot && type === "private")
        {
            if (text === telegramCommands.start) startChatPv({first_name, last_name, telegram_username, telegram_id, telegram_chat_id})
            else if (text === telegramCommands.addExchange) promptAddExchangeTelegram({message_id, telegram_chat_id})
            else if (exchangeController.getExchangesInstantly().some(item => item.name.toLowerCase() === text.toLowerCase())) addUserExchangeInProgress({message_id, telegram_id, telegram_chat_id, text})
            else if (text.split(",").length === 4) addUserExchangeCompletely({message_id, telegram_id, telegram_chat_id, text})
            else if (text === telegramCommands.removeExchange) promptRemoveExchangeTelegram({message_id, telegram_id, telegram_chat_id})
            else if (text.includes(telegramConstant.removeExchange)) removeExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
            else sendTelegramMessage({telegram_chat_id, text: telegramConstant.notOk, reply_to_message_id: message_id})
        }
    }
}

const telegramController = {
    handlePvChat,
}

export default telegramController