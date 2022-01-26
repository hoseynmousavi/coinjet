import userController from "../../controllers/userController"
import userExchangeController from "../../controllers/userExchangeController"
import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"
import exchangeController from "../../controllers/exchangeController"

function addUserExchangeInProgress({message_id, telegram_id, telegram_chat_id, text})
{
    const exchanges = exchangeController.getExchangesInstantly()
    exchanges.forEach(exchange =>
    {
        if (exchange.name.toLowerCase() === text.toLowerCase())
        {
            userController.getUserByTelegramId({telegram_id})
                .then(user =>
                {
                    userExchangeController.getUserExchangesByUserIdAndExchangeId({user_id: user._id, exchange_id: exchange._id, progress_level: "in-progress"}) // there is a bug here, if another exchange added, and that's uncompleted
                        .then(userExchanges =>
                        {
                            if (userExchanges?.length)
                            {
                                sendTelegramMessage({telegram_chat_id, text: telegramConstant.alreadySettingExchange + telegramConstant.sendYourCredentialsAndName, reply_to_message_id: message_id})
                            }
                            else
                            {
                                userExchangeController.addUserExchange({user_id: user._id, exchange_id: exchange._id, progress_level: "in-progress"})
                                    .then(() =>
                                    {
                                        sendTelegramMessage({telegram_chat_id, text: telegramConstant.sendYourCredentialsAndName, reply_to_message_id: message_id})
                                    })
                            }
                        })
                })
        }
    })
}

export default addUserExchangeInProgress