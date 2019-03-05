$(function(){

    let socket = io();  
    var clientUser = '';

    var user = {};

    socket.on('usernameCreated', function(data){
        console.log("data here", data);
        user.name = data.name;
        $('#chat-title').append('<span>').text('You are '+user.name);
    });

    $('form').submit(function(e){
        e.preventDefault(); // prevents page from reloading
        console.log(user.name);
        socket.emit('chat message', $('#m').val(), user);
        $('#m').val('');
        return false;
    }); 
    socket.on('chat message', function(msg,user,date){

        if(msg != ""){
            $('#messages').append($('<span>').text(date+' - '+user.name+': '+msg));
        };
    })

    socket.on('chat message - me', function(msg,user,date){

        if(msg != ""){
            $('#messages').append('<span>'+date+' - '+user.name+': '+'<strong>'+msg+'</strong>'+'</span>');
            
        };
    })
    socket.on('user joined - other', function(user){
        $('#messages').append($('<span>').text(user.name+' '+ ' joined'));
        $('#online-users').append($('<li>').text(user.name));
    })

    socket.on('user joined - me', function(user){
        $('#messages').append($('<span>').text(user.name+' <me> joined'));
    })

    socket.on('disconnect', function(){
        $('#messages').append($('<span>').text(user.name+' disconnected'));
        $('#online-users').eq(-1).remove();
    })
    

    socket.on('nameChanged', function(prevName, newName){
        $('#messages').append($('<span>').text(prevName+' has changed their name to '+newName.name));
        user.name = newName.name;
        $('#chat-title').append('<span>').text('You are '+user.name);

    })

    socket.on('updateUsers', function(currentUsers){
        document.getElementById("online-users").innerHTML = '';

        if(currentUsers.length === 1){
            $('#online-users').append($('<li>').text(currentUsers[0].name));
        }
        if (currentUsers.length > 1) {
            currentUsers.forEach(user => {
            $('#online-users').append($('<li>').text(user.name));
        });
        }
    })

    
});
