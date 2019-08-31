//it is front end file for socket.io
//it is client side subscriber, which will take message from user and send it to server side observer 
//It will emit the messages

//this class is going to send a request for connection
class ChatEngine{
    constructor(chatBoxId, userEmail, userName){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

        // io is global variable  which we get after requiring socket
        this.socket = io.connect('http://localhost:5000'); // a connection request is sent and is handeled by connectionHandeler
        //it fires an event connection, which is handled server side

        //if user email exists then call connectionHandler
        if (this.userEmail){
            this.connectionHandler();
        }
    }

    //Connection Handler will handle to and fro interaction between observer and subscriber
    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){ //1st connect event happens on socket 
            console.log('connection established using sockets..');

            //emiting the users email and chat room name, it will be recieved in chat_sockets,1
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial',
                user_name: self.userName
            });

            self.socket.on('user_joined', function(data){// it detects the event send bu server that user has joined the chat room,4
                console.log('a user joined', data);
            })
            
        });

        //sending a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if (msg != ''){
                self.socket.emit('send_message',{
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial',
                    user_name: self.userName
                });
            }
        });

        self.socket.on('receive_message', function(data){ //if there is a receive_message event occuring then 
            console.log('message received', data.message);
            console.log('data', data);

            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', { //appending the span and in that adding html as message
                'html': data.message
            }));

            newMessage.append($('<sub>',{
                'html': data.user_name
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage); //appending the newly created li in chat message box
            $("#chat-messages-list").stop().animate({ scrollTop: $("#chat-messages-list")[0].scrollHeight}, 1000);
        })
    }
}