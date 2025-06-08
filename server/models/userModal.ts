import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],

    },
    profilePicture: {
        type: String,
        default: "https://www.gravatar.com/avatar/00000000000000000000000000000000",
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
        maxlength: 100,
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Users = mongoose.model("Users", userSchema);
export default Users;

