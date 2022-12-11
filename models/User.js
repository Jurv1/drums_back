import { kStringMaxLength } from "buffer";
import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true, 
    },
    passwordHash:{
        type: String,
        require: true,
    },
    avatarURI: String,
},
    {
        timestamps: true,
    },
)

export default mongoose.model('Users', UserSchema)