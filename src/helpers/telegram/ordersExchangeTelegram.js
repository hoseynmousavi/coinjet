import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"
import userExchangeController from "../../controllers/userExchangeController"
import userController from "../../controllers/userController"
import kucoinController from "../../controllers/kucoinController"
import userExchangeConstant from "../../constants/userExchangeConstant"

function ordersExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
{
    const data = text.replace(telegramConstant.ordersExchange, "")
    userController.getUserByTelegramId({telegram_id})
        .then(user =>
        {
            userExchangeController.getUserExchangesByUserId({user_id: user._id, progress_level: userExchangeConstant.progress_level.complete})
                .then(userExchanges =>
                {
                    const userExchange = userExchanges.filter(item => item.name === data)[0]
                    if (userExchange)
                    {
                        if (userExchange.is_futures)
                        {
                            kucoinController.getFutureActiveOrders({userExchange})
                                .then(res =>
                                {
                                    sendTelegramMessage({telegram_chat_id, text: res})
                                })
                        } // TODO
                    }
                    else sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.userExchange404})
                })
        })
}

export default ordersExchangeTelegram