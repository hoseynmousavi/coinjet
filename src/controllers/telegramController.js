import startChatPv from "../helpers/telegram/startChatPv"
import exchangeController from "./exchangeController"
import setUserExchange from "../helpers/telegram/setUserExchange"

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
            else if (text.split(",").length === 4)
            {
                console.log("YES")
            }
            else
            {
                console.log("BITCH", text.split(",").length)
                exchangeController.getExchanges()
                    .then(exchanges =>
                    {
                        exchanges.forEach(exchange =>
                        {
                            if (exchange.name.toLowerCase() === text.toLowerCase())
                            {
                                setUserExchange({message_id, from, chat, exchange})
                            }
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