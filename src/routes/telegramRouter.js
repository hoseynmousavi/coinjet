import routeConstant from "../constants/routeConstant"
import telegramController from "../controllers/telegramController"

function rootRouter(app)
{
    app.route(routeConstant.telegram)
        .post((req, res) =>
        {
            const {message, channel_post} = req.body || {}
            if (message) telegramController.handlePvChat({message})
            else if (channel_post) telegramController.handleChannelChat({message, channel_post})

            res.send({message: "OK"})
        })
}

export default rootRouter