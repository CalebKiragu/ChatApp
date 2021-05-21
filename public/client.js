//import { io } from "/socket.io/socket.io.js";

// import * as io from "socket.io-client";

//const io = require("socket.io-client");

// let socket = io('http://localhost:3000');

let socket = io();

socket.on('connect', () => {
    console.log(`Connected to server.`);
})

socket.on('disconnect', () => {
    console.log(`Disconnected from server.`);
})