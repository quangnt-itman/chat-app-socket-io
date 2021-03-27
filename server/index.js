const express = require("express");
const path = require("path") // built-in NodeJS
const socketIO = require("socket.io");
const http = require("http") // built-in NodeJS
const moment = require("moment");

const app = express();

const server = http.createServer(app);

const publicPath = path.join(__dirname + "/../public")

const io = socketIO(server);

io.on("connection", (socket) => {
  socket.on("USER_INFO", (msg) => {
    const { name, room } = msg;

    socket.join(room)

    socket.emit("MESSAGE_TO_CLIENT", {
      from: "Admin",
      content: "Welcome to the chat app",
      createdAt: moment().format("hh:mm a")
    })

    socket.broadcast.to(room).emit("MESSAGE_TO_CLIENT", {
      from: "Admin",
      content: `${name} joins`,
      createdAt: moment().format("hh:mm a")
    })

    socket.on("MESSAGE_TO_SERVER", (msg) => {
      io.to(room).emit("MESSAGE_TO_CLIENT", {
        from: msg.from,
        content: msg.content,
        createdAt: moment().format("hh:mm a")
      })
    })

    socket.on("LOCATION_TO_SERVER", (msg) => {
      io.to(room).emit("LOCATION_TO_CLIENT", {
        from: msg.from,
        lat: msg.lat,
        lng: msg.lng,
        createdAt: moment().format("hh:mm a")
      })
    })

    socket.on("disconnect", () => {
      console.log("User exit")
    })
  })


})

app.use(express.static(publicPath))


const port = process.env.NODE_ENV || 5000
server.listen(port, () => {
  console.log(`App is running on port ${port}`);
})