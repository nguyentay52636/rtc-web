import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  let onlineUsers = []

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    //add user 
     socket.on('addNewUser',(clerkUser)=> { 
       console.log("Adding new user:", clerkUser);
       if (clerkUser && !onlineUsers.some(user => user?.userId === clerkUser.id)) {
         onlineUsers.push({
           userId: clerkUser.id,
           socketId: socket.id,
           profile: clerkUser
         });
         console.log("Online users:", onlineUsers);
         io.emit('getUsers', onlineUsers);
       }
     })

     socket.on('disconnect',()=> { 
       console.log("User disconnected:", socket.id);
       onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
       io.emit('getUsers', onlineUsers);
     })

     // Video Call Events
     socket.on('videoCall', (data) => {
       console.log('Video call initiated:', data);
       const receiver = onlineUsers.find(user => user.userId === data.receiverId);
       if (receiver) {
         io.to(receiver.socketId).emit('incomingVideoCall', {
           callerId: data.callerId,
           offer: data.offer,
         });
       }
     });

     socket.on('callAccepted', (data) => {
       console.log('Call accepted:', data);
       const caller = onlineUsers.find(user => user.userId === data.callerId);
       if (caller) {
         io.to(caller.socketId).emit('callAccepted', {
           receiverId: data.receiverId,
           answer: data.answer,
         });
       }
     });

     socket.on('callRejected', (data) => {
       console.log('Call rejected:', data);
       const caller = onlineUsers.find(user => user.userId === data.callerId);
       if (caller) {
         io.to(caller.socketId).emit('callRejected', {
           receiverId: data.receiverId,
         });
       }
     });

     socket.on('callEnded', (data) => {
       console.log('Call ended:', data);
       const targetUser = onlineUsers.find(user => user.userId === data.targetUserId);
       if (targetUser) {
         io.to(targetUser.socketId).emit('callEnded', {
           callerId: data.callerId,
         });
       }
     });

     socket.on('iceCandidate', (data) => {
       console.log('ICE candidate received:', data);
       const targetUser = onlineUsers.find(user => user.userId === data.targetUserId);
       if (targetUser) {
         io.to(targetUser.socketId).emit('iceCandidate', {
           candidate: data.candidate,
           callerId: data.callerId,
         });
       }
     });

     // Audio Call Events
     socket.on('audio-call', (data) => {
       console.log('Audio call initiated:', data);
       const receiver = onlineUsers.find(user => user.userId === data.targetUserId);
       if (receiver) {
         io.to(receiver.socketId).emit('incoming-audio-call', {
           callerInfo: data.callerInfo,
         });
       }
     });

     socket.on('audio-call-accepted', (data) => {
       console.log('Audio call accepted:', data);
       const caller = onlineUsers.find(user => user.userId === data.targetUserId);
       if (caller) {
         io.to(caller.socketId).emit('audio-call-accepted', {
           receiverInfo: data.receiverInfo,
         });
       }
     });

     socket.on('audio-call-rejected', (data) => {
       console.log('Audio call rejected:', data);
       const caller = onlineUsers.find(user => user.userId === data.targetUserId);
       if (caller) {
         io.to(caller.socketId).emit('audio-call-rejected', {
           targetUserId: data.targetUserId,
         });
       }
     });

     socket.on('audio-call-ended', (data) => {
       console.log('Audio call ended:', data);
       const targetUser = onlineUsers.find(user => user.userId === data.targetUserId);
       if (targetUser) {
         io.to(targetUser.socketId).emit('audio-call-ended', {
           callDuration: data.callDuration,
         });
       }
     });

     // Test event handler
     socket.on('test', (message) => {
       console.log('Received test message from client:', message);
       socket.emit('test', 'Hello from server!');
     })
    // ...
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});