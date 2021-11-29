import startChatPv from "../helpers/telegram/startChatPv"
import exchangeController from "./exchangeController"
import setUserExchangeProgress from "../helpers/telegram/setUserExchangeProgress"
import setUserExchangeComplete from "../helpers/telegram/setUserExchangeComplete"

function handlePvChat(message)
{
    const {message_id, from, chat, text} = message
    const {is_bot} = from
    const {type} = chat
    if (message_id && from && chat && text)
    {
        if (!is_bot && type === "private")
        {
            if (text === "/start") startChatPv({message_id, from, chat})
            else if (text.split(",").length === 4) setUserExchangeComplete({message_id, from, chat, data: text.trim().replace(/ /g, "").split(",")})
            else
            {
                exchangeController.getExchanges()
                    .then(exchanges =>
                    {
                        exchanges.forEach(exchange =>
                        {
                            if (exchange.name.toLowerCase() === text.toLowerCase()) setUserExchangeProgress({message_id, from, chat, exchange})
                        })
                    })
            }
        }
    }
}

const telegramController = {
    handlePvChat,
}

export default telegramController