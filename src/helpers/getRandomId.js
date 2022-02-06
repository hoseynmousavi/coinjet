function getRandomId()
{
    return (((1+Math.random())*0x1000000000)|0).toString(16)
}

export default getRandomId