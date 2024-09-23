import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({

    subscriber : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    channel : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
} , {timestamps: true})

const Subscription = mongoose.model("Subscription" , subscriptionSchema)

export default Subscription