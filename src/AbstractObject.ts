import Vec from "./Vec";
import { ForceArm } from "./ForceArm";
import Setting from "./Setting";


export default abstract class AbstractObject {

  public pos: Vec;
  public vel: Vec;
  public ang: number;
  public angVel: number;
  public cog: Vec;
  public mass: number = 10;
  public moment: number = 300;
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

  getAirVel(pos: Vec): Vec {
    return this.getAbsVel(pos)
               .minus(this.setting.getWind(this.getAbsPos(pos)));
  }
 
  updatePosition(dt: number) {
    let forceArms = this.getAllForceArms();
    let acc = this.getNetForce(forceArms).divide(this.mass);
    this.vel = this.vel.plus(acc.times(dt))
    this.pos = this.pos.plus(this.vel.times(dt));

    let angAcc = this.getNetTorque(forceArms) / this.moment;
    this.angVel += angAcc * dt;
    this.ang = this.mod(this.ang + this.angVel * dt, 2*Math.PI);

    if (isNaN(this.angVel) || isNaN(this.ang)) {
      return 'Not a Number!';
    }
  }

  mod = function(number, base) {
    return ((number%base)+base)%base;
  };

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
      netForce.x += forceArm.force.x;
      netForce.y += forceArm.force.y;
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