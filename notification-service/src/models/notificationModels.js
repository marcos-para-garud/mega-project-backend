import mongoose from "mongoose"
import { type } from "os"

const notificationSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type : {
        type: String,
        enum: ['like' , 'comment' , 'subscription' , 'payment'],
        required: true
    },
    message : {
        type: String,
        required: true
    },
    read : {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

const Notification = mongoose.model('Notification' , notificationSchema);

export default Notification;