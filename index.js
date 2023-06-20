const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

app.use(cors({origin: ['http://localhost:3000', 'https://tot-systems.vercel.app'], credentials: true}))

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});


io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('subscribe', (userEmail) => {
        socket.join(userEmail);
        console.log(userEmail)
    });

    socket.on('unsubscribe', (userEmail) => {
        socket.leave(userEmail);
    });

    socket.on('newMessage', async (data) => {
        const {recipientEmail, message: messageData} = data
        io.to(recipientEmail).emit('newMessage', messageData);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});