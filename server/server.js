const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const prettyjson = require('prettyjson');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/isRealString');
const { Users } = require('./utils/users');

//const { generateMessage, generateLocationMessage } = require('../server/utils/message');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log(`A new user just connected.`);

    socket.on('join', (params, callBack) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callBack('Name and Room are required.');
        }
        //console.log(socket.id);
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin',`Welcome to room ${params.room}`));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', 'New user joined!'));
        
        callBack();
    })

    socket.on('createMessage', (message, callBack) => {
        // console.log(`createMessage:\n${prettyjson.render(message)}`);
        console.log('createMessage:\n', message);

        let user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        //callBack(`This is the server.`)
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if(user){            
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(coords.user, coords.lat, coords.lng));
        }
        console.log(`\nNew Location Message:\n\nUser: ${coords.user}\nLatitude: ${coords.lat}\nLongitude: ${coords.lng}`)
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected.`);

        let user = users.removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room.`));
        }
    });
});

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

