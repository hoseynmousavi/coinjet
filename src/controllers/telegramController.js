import startChatPv from "../helpers/telegram/startChatPv"
import exchangeController from "./exchangeController"
import sendTelegramMessage from "../helpers/telegram/sendTelegramMessage"
import telegramConstant from "../constants/telegramConstant"
import telegramCommands from "../constants/telegramCommands"
import promptAddExchangeTelegram from "../helpers/telegram/promptAddExchangeTelegram"
import promptRemoveExchangeTelegram from "../helpers/telegram/promptRemoveExchangeTelegram"
import addUserExchangeInProgress from "../helpers/telegram/addUserExchangeInProgress"
import addUserExchangeCompletely from "../helpers/telegram/addUserExchangeCompletely"
import removeExchangeTelegram from "../helpers/telegram/removeExchangeTelegram"
import regexConstant from "../constants/regexConstant"
import overviewExchangeTelegram from "../helpers/telegram/overviewExchangeTelegram"
import signalController from "./signalController"
import positionsExchangeTelegram from "../helpers/telegram/positionsExchangeTelegram"
import ordersExchangeTelegram from "../helpers/telegram/ordersExchangeTelegram"
import request from "../request/request"
import telegramEndpoints from "../constants/telegramEndpoints"
import checkIfSignal from "../helpers/checkIfSignal"

function getMessage(req, res)
{
    const {message, channel_post} = req.body || {}
    if (message) handlePvChat({message})
    else if (channel_post) handleChannelChat({channel_post})
    res.send({message: "OK"})
}

function handlePvChat({message})
{
    const {message_id, from, chat, date, text} = message
    if (message_id && from && chat && date && text)
    {
        const {is_bot, first_name, last_name, username: telegram_username, id: telegram_id} = from
        const {type, id: telegram_chat_id} = chat
        if (!is_bot && type === "private")
        {
            if (text === telegramCommands.start) startChatPv({first_name, last_name, telegram_username, telegram_id, telegram_chat_id})
            else if (text === telegramCommands.addExchange) promptAddExchangeTelegram({message_id, telegram_chat_id})
            else if (exchangeController.getExchangesInstantly().some(item => item.name + telegramConstant.userExchangeSpot === text || item.name + telegramConstant.userExchangeFutures === text)) addUserExchangeInProgress({message_id, telegram_id, telegram_chat_id, text})
            else if (text.split(",").length === 5) addUserExchangeCompletely({message_id, telegram_id, telegram_chat_id, text})
            else if (text === telegramCommands.removeExchange) promptRemoveExchangeTelegram({message_id, telegram_id, telegram_chat_id})
            else if (text.includes(telegramConstant.removeExchange)) removeExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
            else if (text.includes(telegramConstant.overviewExchange)) overviewExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
            else if (text.includes(telegramConstant.positionsExchange)) positionsExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
            else if (text.includes(telegramConstant.ordersExchange)) ordersExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
            else if (telegram_id === 531523817) // TODO make it by db
            {
                const signal = checkIfSignal({text})
                if (signal)
                {
                    const {message, pair, stop, entry, target, is_futures, is_short, leverage} = signal
                    signalController.addSignal({message, pair, stop, entry, target, is_futures, is_short, leverage})
                }
                else sendTelegramMessage({telegram_chat_id, text: telegramConstant.notOk, reply_to_message_id: message_id})
            }
            else sendTelegramMessage({telegram_chat_id, text: telegramConstant.notOk, reply_to_message_id: message_id})
        }
        else sendTelegramMessage({telegram_chat_id, text: telegramConstant.unsupportedWay, reply_to_message_id: message_id})
    }
}

function handleChannelChat({channel_post})
{
    console.log(channel_post)
    const {message_id, sender_chat, author_signature, chat, date, text} = channel_post
    if (message_id && sender_chat && chat && date && text)
    {
        const {type, id: telegram_chat_id} = chat
        if (type === "channel")
        {
            const signal = checkIfSignal({text})
            if (signal)
            {
                const {message, pair, stop, entry, target, is_futures, is_short, leverage} = signal
                signalController.addSignal({message, pair, stop, entry, target, is_futures, is_short, leverage})
            }
        }
        else sendTelegramMessage({telegram_chat_id, text: telegramConstant.unsupportedWay, reply_to_message_id: message_id})
    }
}

function checkSubscription({user_id})
{
    const chat_id = -1001691391431
    return request.post({
        isTelegram: true,
        url: telegramEndpoints.getChatMember,
        data: {
            chat_id,
            user_id,
        },
    })
        .then(res => !!(res.ok && res.result.status !== "left"))
}

const telegramController = {
    getMessage,
    checkSubscription,
}

export default telegramController