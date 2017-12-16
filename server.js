const express = require('express');
const http = require('http');
const socketIo = require("socket.io");
const PORT = process.env.PORT || require("./config.json").SERVER.PORT;

const app = express();
const server = app.listen(PORT, () => {
    console.log("Server started at http://localhost:" + PORT)
});

app.use(express.static("./public"));

const io = socketIo(server);
let idToNameMapper = {};
let nameToIdMapper = {};

io.on('connection', socket => {
    console.log(socket.id + " has connected");

    socket.on('login', data => {
        idToNameMapper[socket.id] = data;
        nameToIdMapper[data] = socket.id;
        socket.emit('logged-in');
    });

    socket.on('message', data => {
        if (data.charAt(0) === '@') {
            let userName = "";
            let stripedData = data.substring(1);
            for (let i = 1; data.charAt(i) !== ' ' && i <= data.length; i++) {
                userName += data.charAt(i);
                stripedData = stripedData.substring(1);
            }
            let userId = nameToIdMapper[userName];
            socket.broadcast.to(userId).emit('chat', {
                handle: idToNameMapper[socket.id],
                message: stripedData
            });
        } else {
            io.sockets.emit('chat', {
                handle: idToNameMapper[socket.id],
                message: data
            });
        }
    })

    socket.on('disconnect', () => console.log(socket.id + " has disconnected"))
});
