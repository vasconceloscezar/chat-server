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
  socket.on("join", (data) => {
    console.log("A user connected");
    const userType = data.userType; // "user" or "customerSupport" or "bot"
    const room = data.domain;

    if (userType === "user") {
      const userRoom = `${data.user}-${room}`;
      socket.join(userRoom);
      console.log(`${data.user} joined the user room: ${userRoom}`);
    } else if (userType === "customerSupport") {
      socket.join(room);
      console.log(`${data.user} joined the customer support room: ${room}`);
    }
  });

  socket.on("message", (data) => {
    const timeRecieved = Date.now();
    console.log(data);
    console.log(`${data.user} said: ${data.message} \n`);

    if (data.userType === "user") {
      const userRoom = `${data.user}-${data.clientInfo.domain}`;
      io.to(userRoom).emit("message", { user: data.user, message: data.message, time: timeRecieved });
      io.to(data.clientInfo.domain).emit("message", { user: data.user, message: data.message, time: timeRecieved });
    } else if (data.userType === "customerSupport") {
      const targetUserRoom = `${data.targetUser}-${data.clientInfo.domain}`;
      io.to(targetUserRoom).emit("message", { user: data.user, message: data.message, time: timeRecieved });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
