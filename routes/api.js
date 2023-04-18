const express = require("express");
const router = express.Router();

// Import controllers
const userController = require("../controllers/userController");
const chatRoomController = require("../controllers/chatRoomController");
const messageController = require("../controllers/messageController");

// User routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/users", userController.getUsers);

// Chat room routes
router.post("/rooms", chatRoomController.createRoom);
router.get("/rooms", chatRoomController.getRooms);

// Message routes
router.post("/messages", messageController.sendMessage);
router.get("/messages", messageController.getMessages);

module.exports = router;
