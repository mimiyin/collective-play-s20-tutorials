let socket = io('/input');

socket.on('connect', function () {
  console.log("Connected");
});

let lastChange = 0;
let str = '';

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255);
  textSize(128);
  text(str, width / 2, height / 2);
}

function keyTyped() {
  let now = millis();

  if(key == ' ') {
    str = '';
    socket.emit('next');
    lastChange = now;
    return;
  }

  str += key;

  let message = {
    char: key,
    speed: now - lastChange
  }
  socket.emit('add', message);

  lastChange = now;
}

function keyPressed() {
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    str = str.slice(0, -1);
    socket.emit('remove');
  }
}
