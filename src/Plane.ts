import Vec from "./Vec";
import Setting from "./Setting";

export default class Plane {

  public pos: Vec;
  public vel: Vec;
  public ang: number;
  public angVel: number;
  public cog: Vec;
  public mass: number = 100;
  private setting: Setting;

  constructor(pos: Vec, vel: Vec, ang: number, angVel: number, cog: Vec, setting: Setting) {
    this.pos = pos;
    this.vel = vel;
    this.ang = ang;
    this.angVel = angVel;
    this.cog = cog;
    this.setting = setting;
  }

  updatePoisition(dt: number) {
    let acc = this.netForce.divide(this.mass);
    this.vel = this.vel.plus(acc.times(dt))
    this.pos = this.pos.plus(this.vel.times(dt));
  }

  getPosVelocity(pos: Vec): Vec {

    let rawArm: Vec = pos.minus(this.cog);
    let norArm: Vec = rawArm.rotate(this.ang);
    let velMag: number = norArm.magnitude * this.angVel;
    let velAng: number = norArm.angle + Math.PI / 2;

    let relVel: Vec = Vec.n(velMag).rotate(velAng);
    let absVel: Vec = relVel.plus(this.vel);

    return absVel;
  }

  private get netForce(): Vec {
    let gForce = this.mass * this.setting.g;

    // add weight
    let response = Vec.n(0, gForce)

    // add user designated thrust
    response = response.plus(Vec.n(
      -2 * gForce * this.setting.getAilerons(), 
      2 * gForce * this.setting.getElevator()
    ));
    return response;
  }


}