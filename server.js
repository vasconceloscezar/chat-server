const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const apiRouter = require("./routes/api");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

mongoose.connect("mongodb://localhost/chat_db", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

io.on("connection", (socket) => {
  // Implement chat functionality here
  socket.on("join", (data) => {
    console.log("A user connected");
    socket.join(data.room);
    console.log(data.user + " joined the room : " + data.room);
    socket.broadcast.to(data.room).emit("new user joined", { user: data.user, message: "has joined this room." });
  });

  socket.on("leave", (data) => {
    console.log(data.user + " left the room : " + data.room);
    socket.broadcast.to(data.room).emit("left room", { user: data.user, message: "has left this room." });
    socket.leave(data.room);
  });

  socket.on("message", (data) => {
    const timeRecieved = Date.now();
    console.log(data);
    console.log(`${timeRecieved} ${data.user} : ${data.message}`);
    // You can also store and process the browserData here if needed
    // console.log(data.browserData);

    io.emit("message", { user: data.user, message: data.message, time: timeRecieved });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
