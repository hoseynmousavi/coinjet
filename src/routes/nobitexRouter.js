import routeConstant from "../constants/routeConstant"
import nobitexController from "../controllers/nobitexController"

function nobitexRouter(app)
{
    app.route(routeConstant.nobitexUserExchangeData)
        .get(nobitexController.getUserExchangeDataRes)
}

export default nobitexRouter