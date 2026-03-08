const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const mongoose= require("mongoose");
const Chat = require("./models/chat.js");
const path = require("path");
const MethodOverride= require("method-override");

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
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
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
   let chats = await Chat.find();
  //  console.log(chats);
   res.render("index", {chats});
});

//create new chat
app.get("/chats/new", (req,res) => {
  res.render("new")
})

//new route
app.post("/chats", (req,res) =>{
  let{from,to ,msg}= req.body ;
  let newChat = new Chat({
    from: from,
    msg :msg,
    to : to,
    created_at: new Date(),
  });
  newChat.save().then((res)=>{
    console.log("chat is saved");
  })
  .catch((err)=>{
    console.log(err); 
  });
  res.redirect("/chats");
});

//edit route
app.get("/chats/:id/edit", async (req,res)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit",{chat});
});

//Update Route
app.put("/chats/:id", async (req, res) => {
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
});

//delete route
app.delete("/chats/:id/", async (req,res)=>{
  let {id}= req.params;
  let deleteChat= await Chat.findByIdAndDelete(id);
  console.log(deleteChat);
  res.redirect("/chats");
});

app.get("/", (req,res)=>{
  res.render("root")
})

app.listen(8080, ()=>{
    console.log("server is listening");
});