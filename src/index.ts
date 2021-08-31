import Stage from "./Stage";
import Setting from "./Setting";
import Plane from "./Plane";
import Vec from "./Vec";


let stage = new Stage(document.getElementById('stage'));
let setting = new Setting();
document.addEventListener('keydown', (e) => {setting.keyDown(e.key)});
document.addEventListener('keyup', (e) => {setting.keyUp(e.key)});

let plane = new Plane(Vec.n(0, 0), Vec.n(20,40), 0, 0, Vec.n(5, 3), setting);

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