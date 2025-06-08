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
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
        maxlength: 100,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Users = mongoose.model("Users", userSchema);
export default Users;

