function countDecimalPoints(number)
{
    const numStr = String(number)
    if (numStr.includes(".")) return numStr.split(".")[1].length
    else return 0
}

export default countDecimalPoints