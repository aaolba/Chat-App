const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const Message = require("../models/messageModel")
const Chat = require("../models/chatModel")


const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log('invalid input');
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        // Populate sender, chat, and users
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await message.populate({
            path: "chat.users",
            select: "name pic email",
        });

        // Update the latest message in the chat
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { latestMessage: message },
            { new: true }
        );

        res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Failed to send message" });
    }
});



const allMessage = asyncHandler(async (req, res) => {

    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate(
            "sender",
            "name pic email"
        ).populate("chat")
        res.json(messages)
    } catch (err) {
        res.status(400)
    }

})


module.exports = { sendMessage, allMessage };


