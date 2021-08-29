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
    let gForce = this.mass * this.setting.g;

    // add weight
    let response = Vec.n(0, gForce)

    // add user designated thrust
    response = response.add(Vec.n(
      -2 * gForce * this.setting.getAilerons(), 
      2 * gForce * this.setting.getElevator()
    ));
    return response;
  }


}