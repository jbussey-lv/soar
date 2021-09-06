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
  public moment: number = 0.033;
  public wings: Wing[] = [];
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

  updatePosition(dt: number) {
    let acc = this.netForce.divide(this.mass);
    this.vel = this.vel.plus(acc.times(dt))
    this.pos = this.pos.plus(this.vel.times(dt));

    let angAcc = this.netTorque / this.moment;
    this.angVel += angAcc * dt;
    this.ang += this.angVel * dt;
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

  getPosPos(pos: Vec) {
    return pos.minus(this.cog)
              .rotate(this.ang)
              .plus(this.pos);
  }

  private get netForce(): Vec {

    let weight = Vec.n(0, this.mass * this.setting.g);

    let lift = this.getLift();

    let thrust = this.getThrust();

    return Vec.sum(weight, lift, thrust);
  }

  private get netTorque(): number {
    return this.setting.getRudder() * 0.05; // STUBBED
  }

  private getLift(): Vec {
    return this.vel.times(-50); // STUBBED
  }

  private getThrust(): Vec {

    let gMag = this.mass * this.setting.g;
    return Vec.n(
      -2 * gMag * this.setting.getAilerons(), 
      2 * gMag * this.setting.getElevator()
    );
  }


}