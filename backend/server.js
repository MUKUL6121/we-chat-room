// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, "public")));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your React app
    methods: ["GET", "POST"],
  },
});

var chats = [];
var users = 0;

io.on("connection", (socket) => {
  users++;
  io.emit("users", users);
  console.log("User connected:", socket.id);

  socket.emit("old_chat", chats);

  socket.on("send_message", (data) => {
    chats.push(data);
    console.log("Message received", data);
    io.emit("old_chat", chats);
  });

  socket.on("disconnect", () => {
    users--;
    io.emit("users", users);
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(2000, () =>
  console.log("Server running on port 2000\n http://localhost:2000")
);
