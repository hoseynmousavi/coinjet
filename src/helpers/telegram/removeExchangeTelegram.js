import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"
import userExchangeController from "../../controllers/userExchangeController"
import userController from "../../controllers/userController"
import userExchangeConstant from "../../constants/userExchangeConstant"
import userFuturesSocket from "../kucoin/userFuturesSocket"
import userSpotSocket from "../kucoin/userSpotSocket"

function removeExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
{
    const data = text.replace(telegramConstant.removeExchange, "")
    userController.getUserByTelegramId({telegram_id})
        .then(user =>
        {
            userExchangeController.getUserExchangesByUserId({user_id: user._id, progress_level: userExchangeConstant.progress_level.complete})
                .then(userExchanges =>
                {
                    const userExchange = userExchanges.filter(item => item.name === data)[0]
                    if (userExchange)
                    {
                        userExchangeController.removeUserExchangeByUserExchangeIdAndUserId({userExchangeId: userExchange._id, user_id: user._id})
                            .then(() =>
                            {
                                if (userExchange.is_futures) userFuturesSocket.closeSocket({userExchangeId: userExchange._id})
                                else userSpotSocket.closeSocket({userExchangeId: userExchange._id})
                                sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.removeUserExchangeDone})
                            })
                            .catch(() => sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.removeUserExchangeErr}))
                    }
                    else sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.userExchange404})
                })
        })
}

export default removeExchangeTelegram