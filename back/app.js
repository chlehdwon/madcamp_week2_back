import express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';
import cors from 'cors';
import path from 'path';
import sequelize_user from './utils/database_user.js';
import router from './routes/routes.js';
import {addUser, removeUser, getUser, getUsersInRoom} from './utils/room_user.js'




const PORT = process.env.PORT || 443;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use((_, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });
app.use(router);

sequelize_user.sync(); 

io.on('connection',socket=>{
    socket.on('join', (payload, callback) => {
        let numberOfUsersInRoom = getUsersInRoom(payload.room).length

        const { error, newUser} = addUser({
            id: socket.id,
            name: numberOfUsersInRoom===0 ? 'Player 1' : 'Player 2',
            room: payload.room,
            pokemon: payload.pokemon
        })

        if(error)
            return callback(error)

        socket.join(newUser.room)

        io.to(newUser.room).emit('roomData', {room: newUser.room, users: getUsersInRoom(newUser.room)})
        socket.emit('currentUserData', {name: newUser.name})
        callback()
    })
    socket.on('initGameState', gameState => {
        const user = getUser(socket.id)
        if(user)
            io.to(user.room).emit('initGameState', gameState)
    })

    socket.on('updateGameState', gameState => {
        const user = getUser(socket.id)
        if(user)
            io.to(user.room).emit('updateGameState', gameState)
    })

    socket.on('wait', ()=>{
        const user = getUser(socket.id)
        if(user)
            setTimeout(()=>io.to(user.room).emit('reupdate'),1500)  
    })

    socket.on('room_disconnect', () => {
        const user = removeUser(socket.id)
        if(user)
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
    })


});

server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
