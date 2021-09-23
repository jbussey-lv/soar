import Vec from "./Vec";
import { ForceArm } from "./ForceArm";
import Setting from "./Setting";


export default abstract class AbstractObject {

  public pos: Vec;
  public vel: Vec;
  public ang: number;
  public angVel: number;
  public cog: Vec;
  public mass: number = 100;
  public moment: number = 0.033;
  public setting: Setting;

  constructor(pos: Vec, vel: Vec, ang: number, angVel: number, cog: Vec, setting: Setting) {
    this.pos = pos;
    this.vel = vel;
    this.ang = ang;
    this.angVel = angVel;
    this.cog = cog;
    this.setting = setting;
  }

  protected abstract getAllForceArms(): ForceArm[];
 
  updatePosition(dt: number) {
    let forceArms = this.getAllForceArms();
    let acc = this.getNetForce(forceArms).divide(this.mass);
    this.vel = this.vel.plus(acc.times(dt))
    this.pos = this.pos.plus(this.vel.times(dt));

    let angAcc = this.getNetTorque(forceArms) / this.moment;
    this.angVel += angAcc * dt;
    this.ang += this.angVel * dt;
  }

  getArm(pos: Vec): Vec {
    return pos.minus(this.cog)
              .rotate(this.ang);
  }

  getAbsPos(pos: Vec) {
    return this.getArm(pos)
               .plus(this.pos);
  }

  getAbsVel(pos: Vec): Vec {

    let norArm: Vec = this.getArm(pos);
    let velMag: number = norArm.magnitude * this.angVel;
    let velAng: number = norArm.angle + Math.PI / 2;

    let relVel: Vec = Vec.n(velMag).rotate(velAng);
    let absVel: Vec = relVel.plus(this.vel);

    return absVel;
  }

  private getNetForce(allForceArms: ForceArm[]): Vec {

    let netForce = Vec.n();

    allForceArms.forEach(forceArm => {
      netForce.plus(forceArm.force);
    })

    return netForce;
  }

  private getNetTorque(allForceArms: ForceArm[]): number {
    let netTorque: number = 0;
    allForceArms.forEach(forceArm => {
      netTorque += this.getTorque(forceArm);
    });
    return netTorque;
  }

  private getTorque(forceArm: ForceArm): number {
    let theta: number = forceArm.force.angle - forceArm.arm.angle;
    return forceArm.force.magnitude * 
           forceArm.arm.magnitude *
           Math.sin(theta);
  }
}