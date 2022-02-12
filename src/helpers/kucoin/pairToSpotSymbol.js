function pairToSpotSymbol({pair})
{
    return pair.replace("/", "-")
}

export default pairToSpotSymbol