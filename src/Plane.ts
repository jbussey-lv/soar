import Vec from "./Vec";
import Setting from "./Setting";

export default class Plane {

  public pos: Vec;
  public vel: Vec;
  private setting: Setting;
  public mass: number = 100;

  constructor(position: Vec, velocity: Vec, setting: Setting) {
    this.pos = position;
    this.vel = velocity;
    this.setting = setting;
  }

  updatePoisition(dt: number) {
    let acc = this.netForce.divide(this.mass);
    this.vel = this.vel.add(acc.times(dt))
    this.pos = this.pos.add(this.vel.times(dt));
  }

  private get netForce(): Vec {
    return this.setting.g(this.pos).times(this.mass);
  }


}