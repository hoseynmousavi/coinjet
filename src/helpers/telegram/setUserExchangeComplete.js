import userController from "../../controllers/userController"
import userExchangeController from "../../controllers/userExchangeController"
import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"
import e from "express"

function setUserExchangeComplete({message_id, from, chat, data})
{
    const {id: telegram_id} = from
    const {id: telegram_chat_id} = chat
    userController.getUserByTelegramId({telegram_id})
        .then(user =>
        {
            userExchangeController.getUserExchangesByUserIdAndExchangeId({user_id: user._id, progress_level: "in-progress"})
                .then(userExchanges =>
                {
                    console.log(user._id)
                    console.log(userExchanges)
                    if (userExchanges?.length === 1)
                    {
                        console.log(userExchanges[0]._id)
                        const name = data[0]
                        const user_key = data[1]
                        const user_secret = data[2]
                        const user_passphrase = data[3]
                        userExchangeController.updateUserExchange({userExchangeId: userExchanges[0]._id, update: {name, user_key, user_passphrase, user_secret}})
                            .then(() => sendTelegramMessage({chat_id: telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.exchangeCompleted}))
                            .catch(err => console.log(err))
                    }
                    else
                    {
                        sendTelegramMessage({chat_id: telegram_chat_id, text: telegramConstant.noUnCompletedExchange, reply_to_message_id: message_id})
                    }
                })
        })
}

export default setUserExchangeComplete