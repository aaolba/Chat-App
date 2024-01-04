const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv")
const connectDB = require('./config/db')
const colors = require('colors')
const userRoutes = require('./routes/useRoutes')
const chatRoutes = require('./routes/chatRoutes')
const { registerUser } = require('./controllers/userControllers');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const messageRoutes = require("./routes/messageRoutes")
const app = express()
dotenv.config()
connectDB()
app.use(express.json()) //make the app accepts json data
app.get('/', (req, res) => {
    res.send('api is running')
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)

const port = process.env.port || 3000

const server = app.listen(port, console.log(`server started on port ${port}`.yellow.bold))
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})
io.on('connection', (socket) => {
    console.log("connected to socket.io")

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit('connected')
    })
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("user joined room " + room)
    })
    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on('new-message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat
        if (!chat.users) return console.log("chat.user not defined")

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return
            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });



    })
    socket.off("setup", () => {
        socket.leave(userData._id)
    })
})