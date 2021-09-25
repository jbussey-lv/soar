import Stage from "./Stage";
import Setting from "./Setting";
import Plane from "./Plane";
import Vec from "./Vec";
import Wing from "./Wing";
import Engine from "./Engine";

let stage = new Stage(document.getElementById('stage'), true);
let setting = new Setting();
document.addEventListener('keydown', (e) => {setting.keyDown(e.key)});
document.addEventListener('keyup', (e) => {setting.keyUp(e.key)});

let engine: Engine = new Engine(Vec.n(9,2), 0, 100, ()=>setting.getThrust());

let wing: Wing = new Wing(Vec.n(6,3), 0.07, 0, 10, 4, ()=>0);

let tail: Wing = new Wing(Vec.n(1,2), -0.01, Math.PI/6, 3, 2, ()=>setting.getElevator());

let plane = new Plane(
  Vec.n(10, 50),
  Vec.n(30,0),
  0,
  0,
  Vec.n(7, 2),
  setting
);

plane.addWing(wing);
plane.addWing(tail);

plane.addEngine(engine);

stage.addPlane(plane);

let ts = 1/60;
let speedRatio = 1;

setInterval(
  () => {
    setting.setGamepad(navigator.getGamepads()[0]);
    plane.updatePosition(ts * speedRatio);
    stage.render();
  }, 
  ts * 1000
);

stage.render();