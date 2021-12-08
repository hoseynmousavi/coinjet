import routeConstant from "../constants/routeConstant"
import kucoinController from "../controllers/kucoinController"

function kucoinRouter(app)
{
    app.route(routeConstant.kucoinMiddleWare)
        .post(kucoinController.requestMiddleWareRes)
}

export default kucoinRouter