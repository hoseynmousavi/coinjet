import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"
import userExchangeController from "../../controllers/userExchangeController"
import userController from "../../controllers/userController"

function removeExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
{
    const data = text.replace(telegramConstant.removeExchange, "")
    userController.getUserByTelegramId({telegram_id})
        .then(user =>
        {
            userExchangeController.getUserExchangesByUserId({user_id: user._id, progress_level: "complete"})
                .then(userExchanges =>
                {
                    const removeItem = userExchanges.filter(item => item.name === data)[0]
                    if (removeItem)
                    {
                        userExchangeController.removeUserExchangeByUserExchangeIdAndUserId({userExchangeId: removeItem._id, user_id: user._id})
                            .then(() => sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.removeUserExchangeDone}))
                            .catch(() => sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.removeUserExchangeErr}))
                    }
                    else sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.removeUserExchange404})
                })
        })
}

export default removeExchangeTelegram