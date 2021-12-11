import routeConstant from "../constants/routeConstant"
import userExchangeController from "../controllers/userExchangeController"

function userExchangeRouter(app)
{
    app.route(routeConstant.userExchange)
        .get(userExchangeController.getUserExchangesRes)
        .post(userExchangeController.addUserExchangesRes)
        .delete(userExchangeController.deleteUserExchangesRes)
}

export default userExchangeRouter