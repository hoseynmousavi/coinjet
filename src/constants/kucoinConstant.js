const kucoinConstant = {
    spot: {
        getAccounts: "/api/v1/accounts",
        getPublicSocket: "/api/v1/bullet-public",
        getPrivateSocket: "/api/v1/bullet-private"
    },
    future: {
        accountOverview: "/api/v1/account-overview?currency=USDT",
        order: "/api/v1/orders",
        positions: "/api/v1/positions",
        orders: "/api/v1/orders?symbol=XBTUSDTM",
    },
}

export default kucoinConstant