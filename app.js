var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookie = require('cookie');


app.use('/assets', express.static('assets'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', function(socket){
    
    socket.broadcast.emit('user joined');
    socket.on('disconnect', function(){
        io.emit('user disconnected');
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
})