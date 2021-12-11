import routeConstant from "../constants/routeConstant"
import kucoinController from "../controllers/kucoinController"
import userExchangeController from "../controllers/userExchangeController"

function kucoinRouter(app)
{
    app.route(routeConstant.kucoinUserExchangeData)
        .get(kucoinController.getUserExchangeDataRes)
}

export default kucoinRouter