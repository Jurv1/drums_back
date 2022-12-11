import mongoose from "mongoose";
import { UserSchema } from "./User.js";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    text: {
        type: String,
        require: true,
        unique: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    viesCount: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true,
    },
    imageUrl: String,
},
    {
        timestamps: true,
    },
)

export default mongoose.model('Post', PostSchema)