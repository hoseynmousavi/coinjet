const kucoinConstant = {
    spot: {
        getAccountOverview: currency => `/api/v1/accounts?currency=${currency}`,
        getPrivateSocket: "/api/v1/bullet-private",
    },
    future: {
        accountOverview: "/api/v1/account-overview?currency=USDT",
        getPrivateSocket: "/api/v1/bullet-private",
        order: "/api/v1/orders",
        positions: "/api/v1/positions",
        orders: "/api/v1/orders?status=active",
        activeContracts: "/api/v1/contracts/active",
        cancelOrder: exchange_order_id => `/api/v1/orders/${exchange_order_id}`,
    },
}

export default kucoinConstant