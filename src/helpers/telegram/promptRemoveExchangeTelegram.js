import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"
import userExchangeController from "../../controllers/userExchangeController"
import userController from "../../controllers/userController"
import userExchangeConstant from "../../constants/userExchangeConstant"

function promptRemoveExchangeTelegram({message_id, telegram_id, telegram_chat_id})
{
    userController.getUserByTelegramId({telegram_id})
        .then(user =>
        {
            userExchangeController.getUserExchangesByUserId({user_id: user._id, progress_level: userExchangeConstant.progress_level.complete})
                .then(userExchanges =>
                {
                    if (userExchanges?.length)
                    {
                        sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.chooseExchanges, reply_buttons: userExchanges.map(item => ({text: telegramConstant.removeExchange + item.name}))})
                    }
                    else
                    {
                        sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.youDontHaveUserExchange})
                    }
                })
        })
}

export default promptRemoveExchangeTelegram