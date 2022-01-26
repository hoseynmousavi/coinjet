import exchangeController from "../../controllers/exchangeController"
import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"

function promptAddExchangeTelegram({telegram_chat_id, message_id})
{
    exchangeController.getExchanges()
        .then(exchanges =>
        {
            if (exchanges?.length)
            {
                sendTelegramMessage({telegram_chat_id, reply_to_message_id: message_id, text: telegramConstant.chooseExchanges, reply_buttons: exchanges.map(item => ({text: item.name}))})
            }
        })
}

export default promptAddExchangeTelegram