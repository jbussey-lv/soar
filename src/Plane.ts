import Vec from "./Vec";
import Setting from "./Setting";
import Wing from "./Wing";
import Engine from "./Engine";
import AbstractObject from "./AbstractObject";
import { ForceArm } from "./ForceArm";

export default class Plane extends AbstractObject {

  public wings: Wing[] = [];
  public engine: Engine;

  constructor(pos: Vec, vel: Vec, ang: number, angVel: number, cog: Vec, engine: Engine, setting: Setting) {
    super(pos, vel, ang, angVel, cog, setting);
    this.engine = engine;
  }

  addWing(wing: Wing) {
    this.wings.push(wing);
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

  private getEngineForceArm(): ForceArm {
    let force = Vec.n(this.engine.thrust).rotate(this.engine.ang).rotate(this.ang);
    let arm = this.getArm(this.engine.pos);
    return {force, arm};
  }

  protected getAllForceArms(): ForceArm[]{
    let forceArms: ForceArm[] = [
      this.getWeightForceArm(),
      this.getEngineForceArm()
    ];
    this.wings.forEach(wing => {
      forceArms.push(this.getWingForceArm(wing));
    });
    return forceArms;
  }

 

}