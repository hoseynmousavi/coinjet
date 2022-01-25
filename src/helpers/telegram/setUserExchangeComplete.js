import userController from "../../controllers/userController"
import userExchangeController from "../../controllers/userExchangeController"
import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"

function setUserExchangeComplete({message_id, from, chat, text})
{
    const data = text.trim().replace(/ /g, "").split(",")
    const {id: telegram_id} = from
    const {id: telegram_chat_id} = chat
    userController.getUserByTelegramId({telegram_id})
        .then(user =>
        {
            userExchangeController.getUserExchangesByUserId({user_id: user._id, progress_level: "in-progress"})
                .then(userExchanges =>
                {
                    if (userExchanges?.length === 1)
                    {
                        const name = data[0]
                        const user_key = data[1]
                        const user_secret = data[2]
                        const user_passphrase = data[3]
                        userExchangeController.updateUserExchange({userExchangeId: userExchanges[0]._id, update: {name, user_key, user_passphrase, user_secret, progress_level: "complete"}})
                            .then(() => sendTelegramMessage({chat_id: telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.exchangeCompleted}))
                    }
                    else
                    {
                        sendTelegramMessage({chat_id: telegram_chat_id, text: telegramConstant.noUnCompletedExchange, reply_to_message_id: message_id})
                    }
                })
        })
}

export default setUserExchangeComplete