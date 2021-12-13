import routeConstant from "../constants/routeConstant"
import exchangeController from "../controllers/exchangeController"

function exchangeRouter(app)
{
    app.route(routeConstant.exchange)
        .get(exchangeController.getExchangesRes)
        .post(exchangeController.addExchangeRes)
}

export default exchangeRouter