function nobitexHeaders({userExchange})
{
    return {"Authorization": "Token " + userExchange.user_key}
}

export default nobitexHeaders