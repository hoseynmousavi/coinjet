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
            else sendTelegramMessage({telegram_chat_id, text: telegramConstant.notOk, reply_to_message_id: message_id})
        }
        else sendTelegramMessage({telegram_chat_id, text: telegramConstant.unsupportedWay, reply_to_message_id: message_id})
    }
}

function handleChannelChat({channel_post})
{
    const {message_id, sender_chat, author_signature, chat, date, text} = channel_post
    if (message_id && sender_chat && chat && date && text)
    {
        const {type, id: telegram_chat_id} = chat
        if (type === "channel")
        {
            const message = text.toLowerCase()
                .replaceAll(regexConstant.emoji, "")
                .replaceAll("#", "")
                .replaceAll(" ", "")
                .replaceAll("\n", " ")
            let is_short, is_futures, pair, leverage, entry, target, stop = null
            if (message.includes("short") || message.includes("long")) is_short = message.includes("short")
            if (message.includes("spot") || message.includes("futures")) is_futures = message.includes("futures")
            pair = message.match(regexConstant.pair)?.[0]?.replace("pair:", "")?.toUpperCase()
            leverage = message.match(regexConstant.leverage)?.[0]?.replace("leverage:", "")
            entry = message.match(regexConstant.entry)?.[0]?.replace("entry:", "").split("-")
            target = message.match(regexConstant.target)?.[0]?.replace("target:", "").split("-")
            stop = message.match(regexConstant.stop)?.[0]?.replace("stop:", "")

            if ((is_futures === false || (is_futures === true && is_short !== null && leverage)) && pair && entry && target && stop)
            {
                signalController.addSignal({message, pair, stop, entry, target, is_futures, is_short, leverage})

                sendTelegramMessage({
                    telegram_chat_id,
                    reply_to_message_id: message_id,
                    text: JSON.stringify({
                        is_futures,
                        pair,
                        leverage,
                        entry,
                        target,
                        stop,
                    }),
                })
            }
        }
        else sendTelegramMessage({telegram_chat_id, text: telegramConstant.unsupportedWay, reply_to_message_id: message_id})
    }
}

const telegramController = {
    getMessage,
}

export default telegramController