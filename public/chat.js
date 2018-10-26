// Make connection
var socket = io.connect('http://hmchat.herokuapp.com');
//10.11.1.188:4000
// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback'),
      keypressed,
      usersOnline = document.getElementById('usersOnline');

// Emit events
btn.addEventListener('click', function() {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

message.addEventListener('keydown', function(e) {
	clearTimeout(keypressed)
    socket.emit('typing', handle.value);
    if (e.keyCode == 13) {
    	btn.click();
    }
})
message.addEventListener('keyup', function() {
	keypressed = setTimeout(function() {
		socket.emit('stopedTyping');
	}, 1000);
})
// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

socket.on('stopedTyping', function() {
	feedback.innerHTML = '';
});

socket.on('userConnected', function(data) {
	usersOnline.innerHTML = data;
});