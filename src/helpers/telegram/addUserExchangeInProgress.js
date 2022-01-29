import userController from "../../controllers/userController"
import userExchangeController from "../../controllers/userExchangeController"
import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"
import exchangeController from "../../controllers/exchangeController"
import userExchangeConstant from "../../constants/userExchangeConstant"

function addUserExchangeInProgress({message_id, telegram_id, telegram_chat_id, text})
{
    const exchanges = exchangeController.getExchangesInstantly()
    exchanges.forEach(exchange =>
    {
        if (exchange.name + telegramConstant.userExchangeSpot === text || exchange.name + telegramConstant.userExchangeFutures === text)
        {
            userController.getUserByTelegramId({telegram_id})
                .then(user =>
                {
                    userExchangeController.removeUserExchangeByProgressLevel({user_id: user._id, progress_level: userExchangeConstant.progress_level.inProgress})
                        .then(() =>
                        {
                            const is_futures = text.includes(telegramConstant.userExchangeFutures)
                            userExchangeController.addUserExchange({user_id: user._id, exchange_id: exchange._id, is_futures, progress_level: userExchangeConstant.progress_level.inProgress})
                                .then(() =>
                                {
                                    sendTelegramMessage({telegram_chat_id, text: telegramConstant.sendYourCredentialsAndName, reply_to_message_id: message_id})
                                })
                        })
                })
        }
    })
}

export default addUserExchangeInProgress