const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const result = await newMessage.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.query;
    const messages = await Message.find({ chatRoomId: chatRoomId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};
