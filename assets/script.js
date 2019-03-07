$(function(){

    let socket = io();  
    var clientUser = '';

    var user = {
        color : { r : "00", g : "00", b : "00" },
        name : ""
    };

    socket.on('usernameCreated', function(data){
        console.log("data here", data);
        user.name = data.name;
        user.color.r = "00";
        user.color.g = "00";
        user.color.b = "FF"; 
        $('#chat-title').append('<div>').text('You are '+user.name);
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
            $('#messages').append('<div class="msg">'+date+'<p style="color: #'+user.r+user.g+user.b+';display: inline;"> '+user.name+': </p>'+msg+'</div>');
        };
    })

    socket.on('chat message - me', function(msg,user,date){

        if(msg != ""){
            $('#messages').append('<div class="msg">'+date+' - '+user.name+': '+'<strong>'+msg+'</strong>'+'</div>');
            
        };
    })
    socket.on('user joined - other', function(user){
        $('#messages').append($('<div class="msg">').text(user.name+' '+ ' joined'));
        $('#online-users').append($('<li>').text(user.name));
    })

    socket.on('user joined - me', function(user){
        $('#messages').append($('<div class="msg">').text(user.name+' <me> joined'));
    })

    socket.on('disconnect', function(){
        $('#messages').append($('<div class="msg">').text(user.name+' disconnected'));
        $('#online-users').eq(-1).remove();
    })
    

    socket.on('nameChanged', function(prevName, newName){
        $('#messages').append($('<div class="msg">').text(prevName+' has changed their name to '+newName.name));
        user.name = newName.name;
        $('#chat-title').append('<div class="msg">').text('You are '+user.name);
    })

    socket.on('colorChanged', function(rgbValue, user){
        $('#messages').append($('<div class="msg">').text(user.name+' has changed color to RRGGBB:'+rgbValue.r+rgbValue.g+rgbValue.b));
        user.color.r = rgbValue.r;
        user.color.g = rgbValue.g;
        user.color.b = rgbValue.b;

    })

    socket.on('nameError', function(data){
        $('#messages').append($('<div class="msg">').text(data +' already exists as a nickname. Please try another.'));
    })

    socket.on('colorError', function(data){
        $('#messages').append($('<div class="msg">').text(data +' is an invalid RGB value for a nickname. Please try again'));
    })

    socket.on('updateUsers', function(currentUsers){
        document.getElementById("online-users").innerHTML = '';

        if(currentUsers.length === 1){
            $('#online-users').append($('<li class="msg">').text(currentUsers[0].name));
        }
        if (currentUsers.length > 1) {
            currentUsers.forEach(user => {
            $('#online-users').append($('<li class="msg">').text(user.name));
        });
        }
    })

    
});
