import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import UserRouter from './routes/userroutes.js';
import messageRouter from './routes/messageroutes.js';
import {Server} from 'socket.io';


const app = express();
const server = http.createServer(app);
// Socket.io setup
export const io= new Server(server, {
    cors: {
        origin: "*" // Update with your client URL
        
    }
});
// store online users
export const userSocketMap={};
// Handle socket connections
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", userId );

    if(userId) {
        userSocketMap[userId]= socket.id;


    }
    //Emit  online users to all connected clients
    io.emit("onlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect"), () => {
        console.log("User disconnected:", userId);
        delete userSocketMap[userId];
        // Emit updated online users to all connected clients
        io.emit("onlineUsers", Object.keys(userSocketMap));
    }
});



// Middleware setup
app.use(cors());
app.use(express.json({limit: "4mb"}));

app.use("/api/status", (req,res) => {
    res.send("Server is running");
})
app.use("/api/auth", UserRouter);
app.use("/api/messages",messageRouter);

//Database
await connectDB();

const PORT = process.env.PORT || 5173;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})