import express from "express"
import cors from "cors"
import data from "./data"
import rootRouter from "./routes/rootRouter"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// mongoose.Promise = global.Promise
// mongoose.connect(data.connectServerDb, {useNewUrlParser: true}).then(() => console.log("connected to db"))

rootRouter(app)

app.listen(data.port, () => console.log(`coinjet is Now Running on Port ${data.port}`))