import exchangeController from "../../controllers/exchangeController"
import sendTelegramMessage from "./sendTelegramMessage"
import telegramConstant from "../../constants/telegramConstant"

function promptAddExchangeTelegram({telegram_chat_id, message_id, isWelcome})
{
    exchangeController.getExchanges()
        .then(exchanges =>
        {
            if (exchanges?.length)
            {
                sendTelegramMessage({
                    telegram_chat_id,
                    reply_to_message_id: message_id,
                    text: (isWelcome ? telegramConstant.welcomeAddExchange : "") + telegramConstant.chooseExchangesForAdd,
                    reply_buttons: exchanges.reduce((sum, item) => item.have_futures ? [...sum, {text: item.name + telegramConstant.userExchangeSpot}, {text: item.name + telegramConstant.userExchangeFutures}] : [...sum, {text: item.name + telegramConstant.userExchangeSpot}], []),
                })
            }
        })
}

export default promptAddExchangeTelegram