const mongoose = require('mongoose')

const register = mongoose.Schema({
    username: {
        type: String,
        required: [true, "please add username"],
        unique: [true, "Username already taken"]
    },
    name: {
        type: String,
        required: [true, "please add firstname"]
    },
    password: {
        type: String,
        required: [true, "please add password"]
    },
    totalTasks: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
}
);

module.exports = mongoose.model("userdataofvibtree", register)