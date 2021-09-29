import tradeController from "../controllers/tradeController"

function tradeRouter(app)
{
    app.route("/trade")
        .post(tradeController.getUser)
}

export default tradeRouter