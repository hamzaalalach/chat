var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});

// Static files
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server),
    nUsers = 0;
io.on('connection', (socket) => {
    console.log('Made socket connection', socket.id);
    nUsers++;
    io.sockets.emit('userConnected', nUsers);
    console.log(nUsers);
    // Handle chat event
    socket.on('chat', function(data){
        // console.log(data);
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
    socket.on('stopedTyping', function() {
        socket.broadcast.emit('stopedTyping');
    });
    socket.on('disconnect', function() {
        nUsers--;
        io.sockets.emit('userConnected', nUsers);
        console.log(nUsers);
    });
});