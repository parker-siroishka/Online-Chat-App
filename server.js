var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookie = require('cookie');

let user = {};

let firstNames = ["Big", "Hairy", "Slimy", "Small", "Chill", "Tall", "Short", "Blue", "Fat", "Skinny", "Bodacious", "Confident", "Beautiful"];
let lastNames = ["Man", "Woman", "Dog", "Cat", "Cow", "Bird", "Taylor", "Buffalo", "Girl", "Boy"];

function randNum(num) {
    return Math.floor((Math.random() * num));
}


function createUserName(arr1, arr2){
    user.firstName = arr1[randNum(13)];
    user.lastName = arr2[randNum(10)];

}

app.use('/assets', express.static('assets'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', function(socket){

    createUserName(firstNames, lastNames);
    
    socket.broadcast.emit('user joined - other', user);
    socket.emit('user joined - me', user);

    socket.on('disconnect', function(user){
        io.emit('user disconnected',user);
    });

    socket.on('chat message', function(msg){
        if(msg.charAt(0 == "/")){
            console.log('chat command');
            io.emit('chat command', msg);
        }
        var d = new Date(); // for now
        let hours = d.getHours(); // => 9
        let minutes = d.getMinutes(); // =>  30
        let seconds = d.getSeconds(); // => 51
        let date = (hours+':'+minutes+':'+seconds);

        io.emit('chat message', msg,user,date);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
})