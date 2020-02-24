let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

app.use(express.static('public'));

let io = require('socket.io').listen(server);

let outputs = io.of('/output');
outputs.on('connection', function(socket){
  console.log('An output client connected: ' + socket.id);

  socket.on('disconnect', function() {
    console.log("An output client has disconnected " + socket.id);
  });
});

let inputs = io.of('/input');
inputs.on('connection', function(socket){
  console.log('An input client connected: ' + socket.id);

  socket.on('add', function(data) {

    let message = {
      id: socket.id,
      data : data
    }

    outputs.emit('add', message);
  });

  socket.on('remove', function() {
    outputs.emit('remove', socket.id);
  });

  socket.on('next', function() {
    outputs.emit('next', socket.id);
  });

  socket.on('disconnect', function() {
    console.log("An input client has disconnected " + socket.id);
    outputs.emit('disconnected', socket.id);
  });
});
