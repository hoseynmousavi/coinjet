function getFirstCurrencyFromPair({pair})
{
    return pair.split("/")[0]
}

export default getFirstCurrencyFromPair