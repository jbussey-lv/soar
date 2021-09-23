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

let plane = new Plane(
  Vec.n(0, 0),
  Vec.n(0,0),
  0,
  0,
  Vec.n(5, 3),
  new Engine(Vec.n(4,2), 0, 100, setting),
  setting
);

plane.addWing(new Wing(
  Vec.n(3,2),
  Math.PI/12,
  Math.PI/12,
  "elevator",
  10,
  1,
  setting));

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