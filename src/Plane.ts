import Vec from "./Vec";
import Setting from "./Setting";
import Wing from "./Wing";

export default class Plane {

  public pos: Vec;
  public vel: Vec;
  public ang: number;
  public angVel: number;
  public cog: Vec;
  public mass: number = 100;
  public wings: Wing[];
  private setting: Setting;


  constructor(pos: Vec, vel: Vec, ang: number, angVel: number, cog: Vec, setting: Setting) {
    this.pos = pos;
    this.vel = vel;
    this.ang = ang;
    this.angVel = angVel;
    this.cog = cog;
    this.setting = setting;
  }

  addWing(wing: Wing) {
    this.wings.push(wing);
  }

  updatePoisition(dt: number) {
    let acc = this.netForce.divide(this.mass);
    this.vel = this.vel.plus(acc.times(dt))
    this.pos = this.pos.plus(this.vel.times(dt));
    this.ang += 0.05;
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

    let gMag = this.mass * this.setting.g;

    let weight = Vec.n(0, gMag);

    let lift = this.vel.times(-50);

    let thrust = Vec.n(
      -2 * gMag * this.setting.getAilerons(), 
      2 * gMag * this.setting.getElevator()
    );

    return Vec.sum(weight, lift, thrust);
  }


}