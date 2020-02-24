if (typeof DeviceOrientationEvent.requestPermission === 'function') {
  document.body.addEventListener('click', function () {
    DeviceOrientationEvent.requestPermission();
    DeviceMotionEvent.requestPermission();
  })
}

let socket = io('/input');

socket.on('connect', function() {
  console.log("Connected");
});

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw(){
  background(255);
  noStroke();
  fill(0);

  let lr = floor(rotationY);
  let tb = floor(rotationX);

  lr = constrain(lr, -90, 90);
  tb = constrain(tb, -90, 90);

  let x = map(lr, -90, 90, 0, width);
  let y = map(tb, -90, 90, 0, height);
  ellipse(x, y, 50, 50);

  socket.emit('tilt', {x: lr, y: tb});
}

function deviceShaken() {
  let force = abs(accelerationX-pAccelerationX) + abs(accelerationY-pAccelerationY);
  socket.emit('shake', force);
}
