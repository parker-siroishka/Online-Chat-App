$(function(){
    let socket = io();  

    var user = {};

    socket.on('usernameCreated', function(data){
        console.log("usernameCreated");  

        user.name = data.name;
        user.color = "ffffff";
        $('#chat-title').append('<div>').text('You are '+user.name);
    });

    $('form').submit(function(e){
        e.preventDefault(); // prevents page from reloading
        console.log(user);
        socket.emit('chat message', $('#m').val(), user);
        $('#m').val('');
        return false;
    }); 
    socket.on('chat message', function(msg,user,date){
        console.log("chat message");  

        if(msg != ""){
            $('#messages').append('<div class="msg">'+date+' - '+'<p style="color: #'+user.color+';display: inline;">'+user.name+'</p>'+': '+msg+'</div>');
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
            
            $('html, body').animate({
                scrollTop: $('#messages').offset().top + $('#messages')[0].scrollHeight
            }, 500);
        };

       
        
    
    })

    socket.on('chat message - me', function(msg,user,date){
        console.log("chat message - me");  
        if(msg != ""){
            $('#messages').append('<div class="msg">'+'<strong>'+date+' - '+'<p style="color: #'+user.color+';display: inline;">'+user.name+'</p>'+': '+msg+'</strong>'+'</div>');
            $('html, body').animate({
                scrollTop: $('#messages').offset().top + $('#messages')[0].scrollHeight
            }, 500);
        };
    })
    socket.on('user joined - other', function(user){
        $('#messages').append($('<div class="msg">').text(user.name+' '+ ' joined'));
        $('#online-users').append($('<li>').text(user.name));
    })

    socket.on('user joined - me', function(user){
        console.log("user joined - me");  
        $('#messages').append($('<div class="msg">').text(user.name+' <me> joined'));
    })

    socket.on('disconnect', function(){
        $('#messages').append($('<div class="msg">').text(user.name+' disconnected'));
        $('#online-users').eq(-1).remove();
    })
    
    socket.on('nameChanged - other', function(prevName,newName){
        console.log("Executed");
        $('#messages').append($('<div class="msg">').text(prevName+' has changed their name to '+newName.name));
    })

    socket.on('nameChanged', function(prevName, newName){
        user.name = newName.name;
        $('#messages').append($('<div class="msg">').text(prevName+' has changed their name to '+newName.name));
        $('#chat-title').append('<div class="msg">').text('You are '+user.name);
    })

    socket.on('colorChanged', function(data){  
        user.color = data.color;    
        console.log("colorChanged " + user.color);  
        $('#messages').append($('<div class="msg">').text(user.name+' has changed color to RRGGBB: '+user.color));

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

    socket.on('pullChatHistory', function(chatHistory){
        chatHistory.forEach(msg => {
            $('#messages').append(msg);
        });
    })


    
});
