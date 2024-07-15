import { Server } from "socket.io";
import express from "express";
import * as http from "http";
import ViteExpress from "vite-express";

const serverPort = 3000;    ////////
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on('connection',(client) => {
    const connectedUserName = client.handshake.query.user;
    console.log(`connection success user: ${connectedUserName}`);

    client.broadcast.emit('new message',{ user: "root", msg:`[${connectedUserName}] enter!`});

    client.on('new message',(data)=>{
        console.log(data);
        // console.log(data.user, "|", data.msg);
        io.emit('new message', {user: data.user, msg: data.msg});
    })
    client.on('disconnect', ()=>{
        console.log(`disconnect ${connectedUserName}`);
        io.emit('new message',{ user: "root", msg:`[${connectedUserName}] exit!`});
    });
});

server.listen(serverPort, ()=>{
    console.log(`Listen on ${serverPort} port`); 
});

// routing page
app.get("/api", (_, res)=>{
    res.send("api page.");
});

ViteExpress.bind(app, server);