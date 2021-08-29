import Vec from "./Vec";
import Setting from "./Setting";

export default class Plane {

  public pos: Vec;
  public vel: Vec;
  private setting: Setting;
  public mass: number = 100;

  constructor(pos: Vec, vel: Vec, setting: Setting) {
    this.pos = pos;
    this.vel = vel;
    this.setting = setting;
  }

  updatePoisition(dt: number) {
    let acc = this.netForce.divide(this.mass);
    this.vel = this.vel.add(acc.times(dt))
    this.pos = this.pos.add(this.vel.times(dt));
  }

  private get netForce(): Vec {
    let response = Vec.n(0, this.mass * this.setting.g)
    if(this.setting.isKeyDown("ArrowUp")){
      response = response.add(Vec.n(0, this.setting.g * -2 * this.mass));
    }
    if(this.setting.isKeyDown("ArrowLeft")){
      response = response.add(Vec.n(this.setting.g * 2 * this.mass, 0));
    }
    if(this.setting.isKeyDown("ArrowRight")){
      response = response.add(Vec.n(this.setting.g * -2 * this.mass, 0));
    }


    return response;
  }


}