import Vec from "./Vec";
import Setting from "./Setting";
import Wing from "./Wing";
import Engine from "./Engine";
import AbstractObject from "./AbstractObject";
import { ForceArm } from "./ForceArm";

export default class Plane extends AbstractObject {

  public wings: Wing[] = [];
  public engines: Engine[] = [];

  constructor(pos: Vec, vel: Vec, ang: number, angVel: number, cog: Vec, setting: Setting) {
    super(pos, vel, ang, angVel, cog, setting);
  }

  addWing(wing: Wing) {
    this.wings.push(wing);
  }

  addEngine(engine: Engine) {
    this.engines.push(engine);
  }

  getAbsWingAngle(wing: Wing): number {
    return wing.ang + this.ang;
  }

  getWingForceArm(wing: Wing): ForceArm {

    let absWingAngle: number = this.getAbsWingAngle(wing);

    let airVel: Vec = this.getAirVel(wing.pos);

    let wingForce: Vec = wing.getForce(absWingAngle, airVel, this.setting.airDensity);

    return {
      force: wingForce,
      arm: this.getAbsPos(wing.pos)
    }
  }

  private getWeightForceArm(): ForceArm {
    let force = Vec.n(0, this.mass * this.setting.g);
    return {
      force,
      arm: Vec.n(0,0)
    }
  }

  private getEngineForceArm(engine: Engine): ForceArm {
    let force = Vec.n(engine.thrust).rotate(engine.ang).rotate(this.ang);
    console.log(force);
    let arm = this.getArm(engine.pos);
    return {force, arm};
  }

  public getAllForceArms(): ForceArm[]{
    let forceArms: ForceArm[] = [this.getWeightForceArm()];
    this.engines.forEach(engine => {
      forceArms.push(this.getEngineForceArm(engine));
    });
    this.wings.forEach(wing => {
      forceArms.push(this.getWingForceArm(wing));
    });
    return forceArms;
  }

 

}