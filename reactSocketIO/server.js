import { Server } from "socket.io";
import express from "express";
import * as http from "http";
import ViteExpress from "vite-express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on('connection',(client) => {
    console.log(client.handshake.query.userName);
    console.log(`connection success ${client.handshake.query.userName}`);
    client.on('new message',(data)=>{
        console.log(data.user, "|", data.msg);
    })
    client.on('disconnect', ()=>{
        console.log(`disconnect ${client.handshake.query.userName}`);
    });
});

server.listen(3000, ()=>{
    console.log('Listen on 3000 port'); 
});

// routing page
app.get("/api", (_, res)=>{
    res.send("api page.");
});

ViteExpress.bind(app, server);