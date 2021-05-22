const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const prettyjson = require('prettyjson');

const { generateMessage, generateLocationMessage } = require('./utils/message');

//const { generateMessage, generateLocationMessage } = require('../server/utils/message');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log(`A new user just connected.`);

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined!'));

    socket.on('createMessage', (message, callBack) => {
        // console.log(`createMessage:\n${prettyjson.render(message)}`);
        console.log('createMessage:\n', message);

        // io.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()            
        // })

        socket.broadcast.emit('newMessage', generateMessage(message.from, message.text));

        callBack(`This is the server.`)
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lng));
    })

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

