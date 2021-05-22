//import { io } from "/socket.io/socket.io.js";

//const moment = require('./libs/moment');

//import { moment } from '../../static/moment';

// import * as io from "socket.io-client";

//const io = require("socket.io-client");

// let socket = io('http://localhost:3000');

let socket = io();

socket.on('connect', function () {
    console.log(`Connected to server.`);
});

socket.on('disconnect', function () {
    console.log(`Disconnected from server.`);
});

socket.on('newMessage', function(message) {
    const formattedTime = moment(message.createdAt).format('LT');
    console.log("newMessage:\n", message);
    let li = document.createElement('li');
    li.innerText = `${message.from} ${formattedTime}: ${message.text}`

    document.querySelector('body').appendChild(li);
});

socket.on('newLocationMessage', function(message) {
    console.log("newLocationMessage:\n", message);
    const formattedTime = moment(message.createdAt).format('LT');

    let li = document.createElement('li');
    let a = document.createElement('a');
    li.innerText = `${message.from} ${formattedTime}:`
    a.setAttribute('target', '_blank');
    a.setAttribute('href', message.url);
    a.innerText = 'My current location';
    li.appendChild(a);

    document.querySelector('body').appendChild(li);
});

document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: document.querySelector('input[name="message"]').value
    }, function () {
        //document.querySelector('input[name="message"]').value = '';
    });
});

document.querySelector('#send-location').addEventListener('click', function (e) {
    e.preventDefault();

    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        //console.log(position);

        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    }, function () {
        alert(`Unable to fetch location.`)
    })
});

