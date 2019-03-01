$(function(){
    var socket = io();
    let cookies = {};
    //let user = {};
    //let cookstr = socket.handshake.headers['cookie'];

    //if(cookstr === undefined) {
     //   user.name = "user-"+ randNum(100);
    //}

    $('form').submit(function(e){
        e.preventDefault(); // prevents page from reloading
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        if(msg != ""){
            $('#messages').append($('<span>').text(msg));
        };
    })
    socket.on('user joined', function(){
        $('#messages').append($('<span>').text('user joined'));
        $('#online-users').append($('<li>').text('Anonymous User'));
    })
    socket.on('user disconnected', function(){
        $('#messages').append($('<span>').text('user disconnected'));
        $('#online-users').eq(-1).remove();
    })

    function randNum(num) {
        return Math.floor((Math.random() * num));
    }
});
