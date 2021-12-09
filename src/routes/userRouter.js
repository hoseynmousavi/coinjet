import routeConstant from "../constants/routeConstant"
import userController from "../controllers/userController"

function userRouter(app)
{
    app.route(routeConstant.userSignup)
        .post(userController.signupRes)

    app.route(routeConstant.userLogin)
        .post(userController.loginRes)
}

export default userRouter