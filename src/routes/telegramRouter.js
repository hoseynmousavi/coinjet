import routeConstant from "../constants/routeConstant"
import telegramController from "../controllers/telegramController"

function rootRouter(app)
{
    app.route(routeConstant.telegram)
        .post(telegramController.getMessage)
}

export default rootRouter