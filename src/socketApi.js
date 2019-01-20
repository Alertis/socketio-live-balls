const socketio=require("socket.io");
const io=socketio();
const socketApi={ };
const users={ };

socketApi.io=io;

io.on("connection",(socket)=>{
    console.log("a user connected");
  
    socket.on('newUser',(data)=>{
        const defaultData ={
            id: socket.id,
            position:{
                x:0,
                y:0
            }
        };

        const userData= Object.assign(data,defaultData);
        users[socket.id]=userData;
        socket.broadcast.emit('newUser',users[socket.id]);
        socket.emit('initPlayers',users);
    });

    socket.on('disconnect',() => {
        socket.broadcast.emit('disUser',users[socket.id]);
        delete users[socket.id];
    });

});

module.exports=socketApi;