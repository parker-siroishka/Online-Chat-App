let express = require('express');
let path = require('path');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let cookie = require('cookie');



let currentUsers = [];


app.use('/assets', express.static('assets'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', function(socket){

    let data = {};
    let nickCmd = "/nick ";
    let rgbCmd = "/nickcolor ";
    data.name = 'user'+ randNum(10000);
    if(currentUsers.indexOf(data.name) === -1) {
        socket.name = data.name;
        currentUsers.push(data);
    } else {
        data.name = 'user'+ randNum(10000);
        socket.name = data.name;
        currentUsers.push(data);
    }
    socket.emit('user joined - me', data);
    socket.broadcast.emit('user joined - other', data);

    socket.emit('usernameCreated', data);
    

    

    io.emit('updateUsers', currentUsers);       
    
    
    

    socket.on('disconnect', function(){
        console.log(socket.name);
        console.log(currentUsers);
        let ind = currentUsers.findIndex(x => x.name === socket.name);
        console.log(ind);
        currentUsers.splice(ind,1);
        io.emit('updateUsers', currentUsers);
    });

    socket.on('chat message', function(msg, user){
        
        if(msg.indexOf(nickCmd)===0){
            let prevName = user.name;
            let alreadyOnline = currentUsers.findIndex(x => x.name === msg.substring(6));
            if(alreadyOnline === -1){
                user.name = msg.substring(6);
                let index = currentUsers.findIndex(x => x.name === prevName)
                currentUsers[index].name = user.name;
                io.emit('updateUsers', currentUsers);
                socket.emit('nameChanged', prevName, user);
            }else {
                console.log("User already exists");
                socket.emit('nameError', msg.substring(6));
            }
            
            
        }else if(msg.indexOf(rgbCmd)===0){
            let colorObject = {}
            let colorCommand = msg.substring(11).trim();
            var re = /[0-9A-Fa-f]{6}/g;
            if (re.test(colorCommand)){
                colorObject.r = colorCommand.substring(0,2);
                colorObject.g = colorCommand.substring(2,4);
                colorObject.b = colorCommand.substring(4,6);
                console.log(colorObject);
                io.emit('colorChanged', colorObject, user);
            }else {
                socket.emit('colorError', colorCommand);
            }
        }else{

            let d = new Date();
            let hours = d.getHours();
            let minutes = d.getMinutes();
            let seconds = d.getSeconds();
            let date = (hours+':'+minutes+':'+seconds);

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