import Stage from "./Stage";
import Setting from "./Setting";
import Plane from "./Plane";
import Vec from "./Vec";
import Wing from "./Wing";
import Engine from "./Engine";

let stage = new Stage(document.getElementById('stage'));
let setting = new Setting();
document.addEventListener('keydown', (e) => {setting.keyDown(e.key)});
document.addEventListener('keyup', (e) => {setting.keyUp(e.key)});

let engine: Engine = new Engine(Vec.n(10,2), 0, 200, ()=>1);

let wing: Wing = new Wing(Vec.n(7.2), 0, 0, 2, 10, ()=>0)

let plane = new Plane(
  Vec.n(0, 0),
  Vec.n(0,0),
  0,
  0,
  Vec.n(5, 3),
  engine,
  setting
);

plane.addWing(wing);

stage.addPlane(plane);

let ts = 1/60;

setInterval(
  () => {
    setting.setGamepad(navigator.getGamepads()[0]);
    plane.updatePosition(ts);
    stage.render();
  }, 
  ts * 1000
);

stage.render();