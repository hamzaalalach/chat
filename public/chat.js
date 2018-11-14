// Make connection
var socket = io.connect('//hmchat.herokuapp.com');
//hmchat.herokuapp.com
// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
    keypressed,
    usersOnline = document.getElementById('usersOnline'),
    overlay = document.getElementById('overlay');


handle.addEventListener('keydown', function(e) {
  if (e.keyCode == 13 && handle.value != '') {
    overlay.style.display = 'none';
  }
});


function positionOptions() {
  if (window.innerHeight <= '260') {
    output.style.height = window.innerHeight * 82 / 100 - 50 + 'px';
  } else if (window.innerHeight <= '400') {
    output.style.height = window.innerHeight * 85 / 100 - 50 + 'px';
  } else {
    output.style.height = window.innerHeight * 90 / 100 - 50 + 'px';
  }
}
positionOptions();
window.addEventListener('resize', function() {
  positionOptions();
});


function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}
// Emit events
btn.addEventListener('click', function() {
  if (message.value != '') {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
  }
  message.focus();
});

message.addEventListener('keydown', function(e) {
    if (e.keyCode != 9 && e.keyCode != 13 && e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18 && e.keyCode != 20) {   
      socket.emit('typing', handle.value);
    }
    if (e.keyCode == 13) {
    	btn.click();
    }
})

message.addEventListener('keyup', function() {
  clearTimeout(keypressed);
	keypressed = setTimeout(function() {
		socket.emit('stopedTyping');
	}, 1500);
})

window.addEventListener('beforeunload', function() {
  socket.emit('userLeft');
});

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + '&nbsp;&nbsp;&nbsp;&nbsp;</strong>&nbsp;<span>' + data.message + '</span></p>';
    scrollToBottom();
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
});

socket.on('stopedTyping', function() {
	feedback.innerHTML = '';
});

socket.on('userConnected', function(data) {
	usersOnline.innerHTML = data;
});
