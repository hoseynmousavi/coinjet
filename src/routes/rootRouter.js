function rootRouter(app)
{
    app.route("*")
        .get((req, res) =>
        {
            console.log("get body", req?.body)
            console.log("get query", req?.query)
            res.send({message: "OK"})
        })
        .post((req, res) =>
        {
            console.log("post", req?.body)
            res.send({message: "OK"})
        })
        .put((req, res) =>
        {
            console.log("put", req?.body)
            res.send({message: "OK"})
        })
        .patch((req, res) =>
        {
            console.log("patch", req?.body)
            res.send({message: "OK"})
        })
        .delete((req, res) =>
        {
            console.log("delete", req?.body)
            res.send({message: "OK"})
        })
}

export default rootRouter