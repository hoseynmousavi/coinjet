import exchangeController from "../../controllers/exchangeController"
import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"

function addExchangeTelegram({telegram_chat_id})
{
    exchangeController.getExchanges()
        .then(exchanges =>
        {
            if (exchanges?.length) sendTelegramMessage({chat_id: telegram_chat_id, text: telegramConstant.chooseExchanges, reply_buttons: exchanges.map(item => ({text: item.name}))})
        })
}

export default addExchangeTelegram