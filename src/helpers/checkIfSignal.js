import regexConstant from "../constants/regexConstant"

function checkIfSignal({text})
{
    const message = text.toLowerCase()
        .replaceAll(regexConstant.emoji, "")
        .replaceAll("#", "")
        .replaceAll(" ", "")

    let pair, is_futures, is_short, risk, entry, target, stop = null
    pair = message.match(regexConstant.pair)?.[0]?.replace("pair:", "")?.toUpperCase()
    if (message.includes("spot") || message.includes("futures")) is_futures = message.includes("futures")
    if (is_futures)
    {
        if (message.includes("short") || message.includes("long")) is_short = message.includes("short")
    }
    risk = message.match(regexConstant.risk)?.[0]?.replace("risk:", "")?.replace("%", "")
    entry = message.match(regexConstant.entries)?.[0]?.replace("entries:\n", "")
    target = message.match(regexConstant.targets)?.[0]?.replace("targets:\n", "")
    stop = message.match(regexConstant.stop)?.[0]?.replace("stoploss:", "")

    if ((is_futures === false || (is_futures === true && is_short !== null)) && pair && risk && entry && target && stop)
    {
        let entries = []
        const entriesTemp = entry.split("\n")
        entriesTemp.forEach(item =>
        {
            const entry = item.replace(regexConstant.entry_target_index, "")
            const percent = entry.match(regexConstant.entry_target_percent)?.[0]?.replace("(", "")?.replace("%", "")?.replace(")", "")
            const price = entry.replace(regexConstant.entry_target_percent, "")
            if (percent && price) entries.push({percent, price})
        })

        let targets = []
        const targetsTemp = target.split("\n")
        targetsTemp.forEach(item =>
        {
            const target = item.replace(regexConstant.entry_target_index, "")
            const percent = target.match(regexConstant.entry_target_percent)?.[0]?.replace("(", "")?.replace("%", "")?.replace(")", "")
            const price = target.replace(regexConstant.entry_target_percent, "")
            if (percent && price) targets.push({percent, price})
        })

        if (targets.length && entries.length) return {pair, is_futures, is_short, risk, entries, targets, stop}
        else return false
    }
    else
    {
        return false
    }
}

export default checkIfSignal