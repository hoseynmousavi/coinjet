import userController from "../../controllers/userController"
import userExchangeController from "../../controllers/userExchangeController"
import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"

function setUserExchange({message_id, from, chat, exchange})
{
    const {id: telegram_id} = from
    const {id: telegram_chat_id} = chat
    userController.getUserByTelegramId({telegram_id})
        .then(user =>
        {
            userExchangeController.getUserExchangesByUserIdAndExchangeId({user_id: user._id, exchange_id: exchange._id, progress_level: "in-progress"})
                .then(userExchanges =>
                {
                    if (userExchanges?.length)
                    {
                        sendTelegramMessage({chat_id: telegram_chat_id, text: telegramConstant.alreadySettingExchange + telegramConstant.sendYourCredentialsAndName, reply_to_message_id: message_id})
                    }
                    else
                    {
                        userExchangeController.addUserExchange({user_id: user._id, exchange_id: exchange._id, progress_level: "in-progress"})
                            .then(() =>
                            {
                                sendTelegramMessage({chat_id: telegram_chat_id, text: telegramConstant.sendYourCredentialsAndName, reply_to_message_id: message_id})
                            })
                    }
                })
        })
}

export default setUserExchange