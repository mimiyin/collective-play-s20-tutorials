let socket = io('/output');

socket.on('connect', function() {
  console.log("Connected");
});

let users = {};

function createNewUser(id) {
  users[id] = {
    pos: { x : width/2, y : height/2 },
    ppos: { x : width/2, y : height/2 }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  socket.on('tilt', function (message) {
    let id = message.id;
    let data = message.data;

    let vel = { x: data.x/10, y: data.y/10 };

    if (!(id in users)) {
      createNewUser(id);
    }

    let user = users[id];

    user.ppos.x = user.pos.x;
    user.ppos.y = user.pos.y;

    user.pos.x += vel.x;
    user.pos.y += vel.y;

    user.speed = dist(user.ppos.x, user.ppos.y, user.pos.x, user.pos.y);

    drip(user.ppos, user.pos, user.speed);

  });

  socket.on('shake', function (message) {
    let id = message.id;
    let user = users[id] || createNewUser(id);
    let force = message.data;
    blop(user.pos, force);
  });

  socket.on('disconnected', function(id){
    delete users[id];
  });
}

function drip(ppos, pos, speed) {
  stroke(0);
  let sw = min(10, 5/speed);
  strokeWeight(sw);
  line(ppos.x, ppos.y, pos.x, pos.y);
}

function blop(pos, sz) {
  noStroke();
  fill(0, 150);
  ellipse(pos.x, pos.y, sz, sz);
}
