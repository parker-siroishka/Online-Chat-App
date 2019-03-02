$(function(){

    var socket = io();  

    $('form').submit(function(e){
        e.preventDefault(); // prevents page from reloading
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg,user,date){

        if(msg != ""){
            $('#messages').append($('<span>').text(date+' - '+user.firstName+user.lastName+': '+msg));
        };
    })
    socket.on('user joined - other', function(user){
        $('#messages').append($('<span>').text(user.firstName+' '+user.lastName+' '+ ' joined'));
        $('#online-users').append($('<li>').text(user.firstName+' '+user.lastName));
    })

    socket.on('user joined - me', function(user){
        $('#messages').append($('<span>').text(user.firstName+' '+user.lastName+' <me> joined'));
        $('#online-users').append($('<li>').text(user.firstName+' '+user.lastName+' <me>'));
    })
    socket.on('user disconnected', function(user){
        $('#messages').append($('<span>').text(user.firstName+' '+user.lastName+' disconnected'));
        $('#online-users').eq(-1).remove();
    })

    socket.on('chat command', function(msg) {
        if(msg.slice(0,6) =="/nick"){
            user.firstName = msg.slice(7);
            user.lastName = "";
        }
    })

});
