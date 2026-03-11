const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const mongoose= require("mongoose");
const Chat = require("./models/chat.js");
const path = require("path");
const MethodOverride= require("method-override");
require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(MethodOverride("_method"));

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/whatsapp");
};

// let chat1= new Chat({
//     from:"vishal",
//     to: "priya",
//     msg:"i think you are sick",
//     created_at: new Date(),
// });

// chat1.save().then((res)=>{
//   console.log(res);
// })


//all chats
app.get("/chats", async (req,res) =>{
  try {
    let chats = await Chat.find();
    res.render("index", {chats});
  } catch(err) {
    console.error("Error fetching chats:", err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
});

//create new chat
app.get("/chats/new", (req,res) => {
  try {
    res.render("new");
  } catch(err) {
    console.error("Error rendering new chat page:", err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
})

//new route
app.post("/chats", async (req,res) =>{
  try {
    let{from,to ,msg}= req.body ;
    let newChat = new Chat({
      from: from,
      msg :msg,
      to : to,
      created_at: new Date(),
    });
    await newChat.save();
    console.log("chat is saved");
    res.redirect("/chats");
  } catch(err) {
    console.error("Error saving chat:", err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
});

//edit route
app.get("/chats/:id/edit", async (req,res)=>{
  try {
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit",{chat});
  } catch(err) {
    console.error("Error editing chat:", err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
});

//Update Route
app.put("/chats/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    console.log(newMsg);
    let updatedChat = await Chat.findByIdAndUpdate(
        id,
        { msg: newMsg },
        { runValidators: true, new: true }
    );
    console.log(updatedChat);
    res.redirect("/chats");
  } catch(err) {
    console.error("Error updating chat:", err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
});

//delete route
app.delete("/chats/:id/", async (req,res)=>{
  try {
    let {id}= req.params;
    let deleteChat= await Chat.findByIdAndDelete(id);
    console.log(deleteChat);
    res.redirect("/chats");
  } catch(err) {
    console.error("Error deleting chat:", err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
});

app.get("/", (req,res)=>{
  res.render("root")
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`server is listening on port ${PORT}`);
});