const ChatRoom = require("../models/ChatRoom");

exports.createRoom = async (req, res) => {
  try {
    const newRoom = new ChatRoom(req.body);
    const result = await newRoom.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error creating chat room", error });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat rooms", error });
  }
};
