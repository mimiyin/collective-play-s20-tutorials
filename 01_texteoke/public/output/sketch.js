let socket = io('/output');

socket.on('connect', function () {
  console.log("Connected");
});

let users = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  textAlign(CENTER, CENTER);

  socket.on('add', function (message) {
    let id = message.id;
    let speed = message.data.speed;
    let charToAdd = message.data.char;

    // New user
    if (!(id in users)) {
      users[id] = {
        text: '',
        speed: 10,
        pos: {
          x: random(50, width-50),
          y: random(50, height-50)
        }
      }
    }

    users[id].speed = speed;
    users[id].text += charToAdd;
  });

  socket.on('remove', function (id) {
    if (!(id in users)) return;

    users[id].text = users[id].text.slice(0, -1);
  });

  socket.on('next', function (id) {
    if (!(id in users)) return;

    users[id].text = '';
  });

  socket.on('disconnected', function (id) {
    delete users[id];
  });
}

function draw() {
  background(255);
  for (let id in users) {
    let user = users[id];
    let txt = user.text;
    let pos = user.pos;
    let speed = pow(5000000/user.speed, .67);
    textSize(speed);
    text(txt, pos.x, pos.y);
  }
}
