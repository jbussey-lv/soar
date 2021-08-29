import Stage from "./Stage";
import Setting from "./Setting";
import Plane from "./Plane";
import Vec from "./Vec";


let stage = new Stage(document.getElementById('stage'));
let setting = new Setting();
document.addEventListener('keydown', (e) => {setting.keyDown(e)});
document.addEventListener('keyup', (e) => {setting.keyUp(e)});

let plane = new Plane(Vec.n(5, 10), Vec.n(10, 25), setting);

stage.addPlane(plane);

let ts = 1/60;

setInterval(
  () => {
    plane.updatePoisition(ts);
    stage.render();
  }, 
  ts * 1000
);

stage.render();