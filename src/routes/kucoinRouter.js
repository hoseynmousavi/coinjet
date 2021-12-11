import routeConstant from "../constants/routeConstant"
import kucoinController from "../controllers/kucoinController"

function kucoinRouter(app)
{
    app.route(routeConstant.exchangeMyAccounts)
        .get(kucoinController.getMyAccountsRes)
}

export default kucoinRouter