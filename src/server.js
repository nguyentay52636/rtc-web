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