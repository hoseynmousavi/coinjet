import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"
import userExchangeController from "../../controllers/userExchangeController"
import userController from "../../controllers/userController"
import kucoinController from "../../controllers/kucoinController"

function overviewExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
{
    const data = text.replace(telegramConstant.overviewExchange, "")
    userController.getUserByTelegramId({telegram_id})
        .then(user =>
        {
            userExchangeController.getUserExchangesByUserId({user_id: user._id, progress_level: "complete"})
                .then(userExchanges =>
                {
                    const item = userExchanges.filter(item => item.name === data)[0]
                    if (item)
                    {
                        kucoinController.getFutureAccountOverview({userExchange: item})
                            .then(res =>
                            {
                                console.log({res})
                            })
                            .catch(err =>
                            {
                                console.log(err)
                            })
                    }
                    else sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.userExchange404})
                })
        })
}

export default overviewExchangeTelegram