const mongoose= require("mongoose");

const chatshema = new mongoose.Schema({
     from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        maxLength: 50
    },
    created_at: {
        type: Date,
        required: true
    }
});

const Chat = mongoose.model("Chat", chatshema);

module.exports= Chat;