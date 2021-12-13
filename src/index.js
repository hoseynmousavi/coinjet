import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import data from "./data"
import exchangeRouter from "./routes/exchangeRouter"
import kucoinRouter from "./routes/kucoinRouter"
import userRouter from "./routes/userRouter"
import userExchangeRouter from "./routes/userExchangeRouter"
import nobitexRouter from "./routes/nobitexRouter"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

mongoose.Promise = global.Promise
mongoose.connect(data.connectServerDb, {useNewUrlParser: true}).then(() => console.log("connected to db"))

userExchangeRouter(app)
exchangeRouter(app)
kucoinRouter(app)
nobitexRouter(app)
userRouter(app)

app.listen(data.port, () => console.log(`coinjet is Now Running on Port ${data.port}`))