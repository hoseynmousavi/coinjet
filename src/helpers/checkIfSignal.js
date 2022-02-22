import regexConstant from "../constants/regexConstant"

function checkIfSignal({text})
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
        return {message, pair, stop, entry, target, is_futures, is_short, leverage}
    }
    else
    {
        return false
    }
}

export default checkIfSignal