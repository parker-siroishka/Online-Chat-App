let express = require('express');
let path = require('path');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const cookie = require('cookie');



let currentUsers = [];
let initialChatMessage = `<div class="msg-initial-chat" >
                                No Prevous Messages Logged...
                          </div>`
let chatHistory = [initialChatMessage];


app.use('/assets', express.static('assets'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', function(socket){

    let data = {};


    socket.color = "ffffff";
    data.name = 'user'+ randNum(10000);
    if(currentUsers.indexOf(data.name) === -1) {
        socket.name = data.name;
    } else {
        data.name = 'user'+ randNum(10000);
        socket.name = data.name;
    }

    socket.on('present cookie', function(userExisted){
        data.name = userExisted;
        currentUsers.push(data);
        socket.name = data.name;
        socket.broadcast.emit('user joined - other', data);
        socket.emit('user joined - me', data);
        io.emit('updateUsers', currentUsers);
    });

    socket.on('no present cookie', function(){
        currentUsers.push(data);
        socket.name = data.name;
        socket.broadcast.emit('user joined - other', data);
        socket.emit('user joined - me', data);
        io.emit('updateUsers', currentUsers);
    });
    
    let nickCmd = "/nick ";
    let rgbCmd = "/nickcolor ";
    
    socket.emit('pullChatHistory', chatHistory);

    socket.emit('usernameCreated', data);

    io.emit('updateUsers', currentUsers);       

    socket.on('disconnect', function(){

        let ind = currentUsers.findIndex(x => x.name === socket.name);
        currentUsers.splice(ind,1);
        io.emit('updateUsers', currentUsers);
    });

    socket.on('chat message', function(msg, user){
        if(msg.indexOf(nickCmd)===0 && (msg.substring(6) !== '')){
            let prevName = user.name;
            let alreadyOnline = currentUsers.findIndex(x => x.name === msg.substring(6));
            if(alreadyOnline === -1){
                user.name = msg.substring(6);
                socket.name = user.name;
                let index = currentUsers.findIndex(x => x.name === prevName)
                currentUsers[index].name = user.name;
                io.emit('updateUsers', currentUsers);
                socket.broadcast.emit('nameChanged - other', prevName, user);
                socket.emit('nameChanged', prevName, user);
            }else {
                socket.emit('nameError', msg.substring(6));
            }
            
            
        }else if(msg.indexOf(rgbCmd)===0){
            let colorCommand = msg.substring(11).trim();
            var re = /[0-9A-Fa-f]{6}/g;
            if (re.test(colorCommand)){
                user.color = colorCommand;
                socket.emit('colorChanged', user);
            }else {
                socket.emit('colorError', colorCommand);
            }
        }else {

            let d = new Date();
            let hours = d.getHours();
            let minutes = d.getMinutes();
            if(minutes < 10){
                minutes = '0'+minutes;
            }

            let seconds = d.getSeconds();
            if(seconds < 10){
                seconds = '0'+seconds;
            }
            let date = (hours+':'+minutes+':'+seconds);

            if(chatHistory.length < 200){
                chatHistory.push('<div class="msg">'+date+' - '+'<p style="color: #'+user.color+';display: inline;"> '+user.name+'</p>'+': '+msg+'</div>')
            }else {
                while(chatHistory.length >= 200){
                    chatHistory.splice(1,1);
                }
            }    
            socket.broadcast.emit('chat message', msg,user,date );
            socket.emit('chat message - me', msg, user, date);
        }
    });

    function randNum(num) {
        return Math.floor((Math.random() * num));
    }
});

http.listen(3000, function(){
    console.log('listening on *:3000');
})