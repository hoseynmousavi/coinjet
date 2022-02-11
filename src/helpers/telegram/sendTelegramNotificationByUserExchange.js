import userController from "../../controllers/userController"
import sendTelegramMessage from "./sendTelegramMessage"

function sendTelegramNotificationByUserExchange({userExchange, text, reply_to_message_id, reply_buttons})
{
    userController.getUserById({_id: userExchange.user_id})
        .then(user =>
        {
            const {telegram_chat_id} = user
            sendTelegramMessage({telegram_chat_id, text, reply_to_message_id, reply_buttons})
        })
}

export default sendTelegramNotificationByUserExchange