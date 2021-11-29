import startChat from "../helpers/telegram/startChat"

function handlePvChat(message)
{
    const {message_id, from, chat, text} = message
    if (message_id && from && chat && text)
    {
        console.log(message)
        if (text === "/start") startChat({message_id, from, chat, text})
        else
        {
            console.log("got shit")
        }
    }
}

const telegramController = {
    handlePvChat,
}

export default telegramController