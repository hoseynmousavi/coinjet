import userController from "../../controllers/userController"
import userExchangeController from "../../controllers/userExchangeController"
import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"

function addUserExchangeCompletely({message_id, telegram_id, telegram_chat_id, text})
{
    const data = text.trim().replace(/ /g, "").split(",")
    userController.getUserByTelegramId({telegram_id})
        .then(user =>
        {
            userExchangeController.getUserExchangesByUserId({user_id: user._id})
                .then(userExchanges =>
                {
                    const inProgressExchanges = userExchanges.filter(item => item.progress_level === "in-progress")
                    if (inProgressExchanges?.length === 1)
                    {
                        const name = data[0]
                        console.log(userExchanges.map(item => item.name), name)
                        console.log(!userExchanges.some(item => item === name))
                        const user_key = data[1]
                        const user_secret = data[2]
                        const user_passphrase = data[3]
                        if (!userExchanges.some(item => item === name))
                        {
                            userExchangeController.updateUserExchange({userExchangeId: inProgressExchanges[0]._id, update: {name, user_key, user_passphrase, user_secret, progress_level: "complete"}})
                                .then(() => sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.exchangeCompleted}))
                        }
                        else
                        {
                            sendTelegramMessage({telegram_chat_id, text: telegramConstant.repeatedUserExchangeName, reply_to_message_id: message_id})
                        }
                    }
                    else
                    {
                        sendTelegramMessage({telegram_chat_id, text: telegramConstant.noUnCompletedExchange, reply_to_message_id: message_id})
                    }
                })
        })
}

export default addUserExchangeCompletely