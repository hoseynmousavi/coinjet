function getCurrencyFromPair({index, pair})
{
    return pair.split("/")[index]
}

export default getCurrencyFromPair