import mongoose from "mongoose"
import signalModel from "../models/signalModel"

const signalTb = mongoose.model("signal", signalModel)

function addSignal(signal)
{
    return new signalTb(signal).save()
}

const signalController = {
    addSignal,
}

export default signalController