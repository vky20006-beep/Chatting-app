const mongoose= require("mongoose");
const Chat = require("./models/chat.js");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
};

let allchats=([{
    from:"neelam",
    to: "priyanshu",
    msg:"i think you are thick",
    created_at: new Date(),
},
{
    from:"divyanshu",
    to: "nikhil",
    msg:"i think you are sanki",
    created_at: new Date(),
},
{
    from:"nikhil",
    to: "aditya",
    msg:"i think you are fat",
    created_at: new Date(),
},
{
    from:"rishabh",
    to: "aditya",
    msg:"i think you are cute",
    created_at: new Date(),
},
]);

Chat.insertMany(allchats);