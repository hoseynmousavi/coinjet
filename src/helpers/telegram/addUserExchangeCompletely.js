import userController from "../../controllers/userController"
import userExchangeController from "../../controllers/userExchangeController"
import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"
import userExchangeConstant from "../../constants/userExchangeConstant"
import userFuturesSocket from "../kucoin/userFuturesSocket"
import kucoinController from "../../controllers/kucoinController"

function addUserExchangeCompletely({message_id, telegram_id, telegram_chat_id, text})
{
    const data = text.split(",").map(item => item.trim())
    userController.getUserByTelegramId({telegram_id})
        .then(user =>
        {
            userExchangeController.getUserExchangesByUserId({user_id: user._id})
                .then(userExchanges =>
                {
                    const inProgressExchanges = userExchanges.filter(item => item.progress_level === userExchangeConstant.progress_level.inProgress)
                    if (inProgressExchanges?.length === 1)
                    {
                        const name = data[0]
                        const user_key = data[1]
                        const user_secret = data[2]
                        const user_passphrase = data[3]
                        if (!userExchanges.some(item => item.name === name))
                        {
                            userExchangeController.updateUserExchange({userExchangeId: inProgressExchanges[0]._id, update: {name, user_key, user_passphrase, user_secret, progress_level: userExchangeConstant.progress_level.complete}})
                                .then(userExchange =>
                                {
                                    sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.exchangeCompleted})
                                    if (userExchange.is_futures)
                                    {
                                        kucoinController.getFutureAccountOverview({userExchange})
                                            .then(res =>
                                            {
                                                sendTelegramMessage({telegram_chat_id, text: telegramConstant.connectionSucceed + JSON.stringify(res)})
                                                userFuturesSocket.startUserSocket({userExchange})
                                            })
                                            .catch(err =>
                                            {
                                                sendTelegramMessage({telegram_chat_id, text: telegramConstant.connectionFail + JSON.stringify(err?.response?.data ?? {})})
                                            })
                                    } // TODO Hoseyn
                                })
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