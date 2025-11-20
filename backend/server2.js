// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://test-room-site.onrender.com"], // your React app
    methods: ["GET", "POST"],
  },
});

const rooms = [];

io.on("connection", (socket) => {
  const updateRooms = () => {
    io.emit("rooms", rooms);
  };
  updateRooms();
  console.log("User connected:", socket.id);

  socket.on("create-room", ({ roomId, password }) => {
    rooms.push({ roomId, password });
    socket.join(roomId);
    console.log("Room Created");
    console.log(rooms);
    updateRooms();
  });
  socket.on("join-room", ({ joinId, joinpassword }) => {
    if (
      rooms.find(
        (room) => room.roomId == joinId && room.password == joinpassword
      )
    ) {
      socket.join(joinId);
      console.log("Room Joined");
      console.log(io.sockets.adapter.sids);
    } else {
      //   socket.emit("error", "Invalid room ID or password");
      console.log("Invalid Room ID");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () =>
  console.log("Server running on port 3000\n http://localhost:3000")
);
