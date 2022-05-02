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
import overviewExchangeTelegram from "../helpers/telegram/overviewExchangeTelegram"
import signalController from "./signalController"
import positionsExchangeTelegram from "../helpers/telegram/positionsExchangeTelegram"
import ordersExchangeTelegram from "../helpers/telegram/ordersExchangeTelegram"
import request from "../request/request"
import telegramEndpoints from "../constants/telegramEndpoints"
import checkIfSignal from "../helpers/checkIfSignal"
import chatConstant from "../constants/chatConstant"

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
            else if (text.split(",").length === 4) addUserExchangeCompletely({message_id, telegram_id, telegram_chat_id, text})
            else if (text === telegramCommands.removeExchange) promptRemoveExchangeTelegram({message_id, telegram_id, telegram_chat_id})
            else if (text.includes(telegramConstant.removeExchange)) removeExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
            else if (text.includes(telegramConstant.overviewExchange)) overviewExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
            else if (text.includes(telegramConstant.positionsExchange)) positionsExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
            else if (text.includes(telegramConstant.ordersExchange)) ordersExchangeTelegram({message_id, telegram_id, telegram_chat_id, text})
            else
            {
                const signal = checkIfSignal({text})
                if (signal)
                {
                    const {pair, is_futures, is_short, risk, entries, targets, stop} = signal
                    signalController.addSignal({telegram_id, signal: {text, telegram_chat_id, title: ((first_name || "") + " " + (last_name || "")).trim(), pair, is_futures, is_short, risk, entries, targets, stop}})
                }
                else sendTelegramMessage({telegram_chat_id, text: telegramConstant.notOk, reply_to_message_id: message_id})
            }
        }
    }
}

function handleChannelChat({channel_post})
{
    const {message_id, sender_chat, author_signature, chat, date, text} = channel_post
    if (message_id && sender_chat && chat && date && text)
    {
        const {type, id: telegram_chat_id, title} = chat
        if (type === "channel")
        {
            const signal = checkIfSignal({text})
            if (signal)
            {
                const {pair, is_futures, is_short, risk, entries, targets, stop} = signal
                signalController.addSignal({signal: {text, telegram_chat_id, title, pair, is_futures, is_short, risk, entries, targets, stop}})
            }
        }
    }
}

function checkSubscription({isBroadcast, telegram_chat_id, user_id})
{
    return new Promise(resolve =>
    {
        if (isBroadcast)
        {
            if (telegram_chat_id === chatConstant.channel_chat_id)
            {
                request.post({
                    isTelegram: true,
                    url: telegramEndpoints.getChatMember,
                    data: {
                        chat_id: chatConstant.channel_chat_id,
                        user_id,
                    },
                })
                    .then(res => resolve(!!(res.ok && res.result.status !== "left")))
                    .catch(() => resolve(false))
            }
            else resolve(false)
        }
        else resolve(true)
    })
}

const telegramController = {
    getMessage,
    checkSubscription,
}

export default telegramController