const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log(`A new user just connected.`)

    socket.on('disconnect', () => {
        console.log(`User disconnected.`);
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})



// const path = require('path');
// const port = process.env.PORT || 3000
// const express = require('express');
// const socketIO = require('socket.io')(port);

// const publicPath = path.join(__dirname, '/../public/index.html');

// let app = express();
// app.use(express.static(publicPath));

// socketIO.on('listen', (port) => {
//     console.log(`Server is up on port ${port}`)
// });

// socketIO.on('connection', (socket) => {
//     socket.on('connect', () => {
//         console.log('A new user just connected.');
//     });
//     socket.on('disconnect', () => {
//         console.log('User disconnected.');
//     });
// })

