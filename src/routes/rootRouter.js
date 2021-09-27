function rootRouter(app)
{
    app.route("*")
        .get((req, res) =>
        {
            console.log("get body: " + req.originalUrl, req?.body)
            console.log("get query: " + req.originalUrl, req?.query)
            res.send({message: "OK"})
        })
        .post((req, res) =>
        {
            console.log("post: " + req.originalUrl, req?.body)
            res.send({message: "OK"})
        })
        .put((req, res) =>
        {
            console.log("put: " + req.originalUrl, req?.body)
            res.send({message: "OK"})
        })
        .patch((req, res) =>
        {
            console.log("patch: " + req.originalUrl, req?.body)
            res.send({message: "OK"})
        })
        .delete((req, res) =>
        {
            console.log("delete: " + req.originalUrl, req?.body)
            res.send({message: "OK"})
        })
}

export default rootRouter