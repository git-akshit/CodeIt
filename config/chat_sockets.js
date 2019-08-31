//it is back end file for socket.io
//it is server send observer(server) which will recieve the incoming connections from all the users which are listners(subscribers)
//It will detect the messages and emit tem to respective users

//It recieves a request for connection
module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function(socket){//when the connection is established
        console.log('new connection recieved', socket.id);

        socket.on('disconnect', function(){ //it will automatically disconnect if client is disconnected
            console.log('socket disconnected');
        });

        socket.on('join_room', function(data){ //on detects the events send by client
            console.log('joining request rec.', data);

            //if chat room of data.chatroom already exists then it will add the user in it or else it will create a new one
            socket.join(data.chatroom);//2

            io.in(data.chatroom).emit('user_joined', data);// when you want to emit a request then use io.in.emit, it will emit to all users that a new user has joined the chat room,3
        });

        //detect send_message and broadcast to everyone in the room
        socket.on('send_message', function(data){ //it will receive the emitted message
            io.in(data.chatroom).emit('receive_message', data); // it will broadcast the received message to everyone in chat room
        });

    }); // connection requested from chat_engine at client side and it sends back at client side automatically that you are connected 

}

//if direct socket connection is not established then it will be polling that means it will pinging the server repeatedly 