import Vec from "./Vec";
import { ForceArm } from "./ForceArm";
import Setting from "./Setting";
import * as _ from "lodash";

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
    
    let obj1 = _.cloneDeep(this);
    obj1.pos = this.pos.clone();
    obj1.vel = this.vel.clone();
    obj1.ang = this.ang;
    obj1.angVel = this.angVel;
    let [acc1, angAcc1] = obj1.getAccs();

    let obj2 = _.cloneDeep(this);
    obj2.pos = this.pos.plus(obj1.vel.times(0.5 * dt));
    obj2.vel = this.vel.plus(acc1.times(0.5 * dt));
    obj2.ang = this.ang + 0.5 * obj1.angVel * dt;
    obj2.angVel = this.angVel + 0.5 * angAcc1 * dt;
    let [acc2, angAcc2] = obj2.getAccs();
  
    let obj3 = _.cloneDeep(this);
    obj3.pos = this.pos.plus(obj2.vel.times(0.5 * dt));
    obj3.vel = this.vel.plus(acc2.times(0.5 * dt));
    obj3.ang = this.ang + 0.5 * obj2.angVel * dt;
    obj3.angVel = this.angVel + 0.5 * angAcc2 * dt;
    let [acc3, angAcc3] = obj3.getAccs();

    let obj4 = _.cloneDeep(this);
    obj4.pos = this.pos.plus(obj3.vel.times(dt));
    obj4.vel = this.vel.plus(acc3.times(dt));
    obj4.ang = this.ang + obj3.angVel * dt;
    obj4.angVel = this.angVel + angAcc3 * dt;
    let [acc4, angAcc4] = obj3.getAccs();
  
    this.pos = this.pos.plus((
      obj1.vel.plus(obj2.vel.times(2))
              .plus(obj3.vel.times(2))
              .plus(obj4.vel))
              .times(dt / 6)
    );

    this.vel = this.vel.plus((
      acc1.plus(acc2.times(2))
          .plus(acc3.times(2))
          .plus(acc4))
          .times(dt / 6)
    );

    this.ang = this.ang + (dt / 6) * (obj1.angVel + 2*obj2.angVel + 2*obj3.angVel + obj4.angVel);
    this.angVel = this.angVel + (dt / 6) * (angAcc1 + 2*angAcc2 + 2*angAcc3 + angAcc4);
  }

  getAccs = function(): [Vec, number] {
    let forceArms = this.getAllForceArms();
    let acc = this.getNetForce(forceArms).divide(this.mass);
    let angAcc = this.getNetTorque(forceArms) / this.moment;
    return [acc, angAcc];
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