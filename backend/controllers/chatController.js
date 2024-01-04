const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log("userid param not sent with request")
        return res.sendStatus(400)
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {
                users: { $elemMatch: { $eq: req.user._id } },
                users: { $elemMatch: { $eq: userId } }

            }
        ]
    }).populate("users", "-password")
        .populate("latestMessage")
    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name pic email"
    })
    console.log(isChat)
    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            users: [req.user._id, userId],
            isGroupChat: false
        }

        try {
            const createdChat = await Chat.create(chatData)
            const FullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password")
            res.status(200).send(FullChat)
        } catch (err) {
            res.status(400)
            throw new Error(err.message);
        }
    }
})



const fetchChats = asyncHandler(async (req, res) => {
    try {
        const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate({
                path: "latestMessage",
                populate: {
                    path: "sender",
                    select: "name pic email",
                },
            })
            .sort({ updatedAt: -1 });

        res.status(200).send(results);
    } catch (error) {
        console.error("Error in fetchChats:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});



const createGroueChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "please fill all the feilds" })
    }

    var users = JSON.parse(req.body.users)

    if (users.length < 2) {
        return res.status(400).send({ message: "you need to add at least two members in a group" });
    }

    users.push(req.user)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        res.status(200).json(fullGroupChat)
    } catch (err) {
        res.status(400)
        throw new Error(err.message)
    }
})


const renameGroup = asyncHandler(async (req, res) => {

    const { chatId, chatName } = req.body
    console.log(chatId)
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        }, {
        new: true
    }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!updatedChat) {
        res.status(400)
        throw new Error("chat not found")
    } else {
        res.status(201).json(updatedChat);
    }

})


const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },

        },
        { new: true }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!added) {
        res.status(400)
        throw new Error('chat not found')
    } else {
        res.status(201).json(added);
    }
})


const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        { new: true }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!removed) {
        res.status(400)
        throw new Error('chat not found')
    } else {
        res.status(201).json(removed);
    }

})
module.exports = { accessChat, fetchChats, createGroueChat, renameGroup, addToGroup, removeFromGroup }