import Vec from "./Vec";
import Setting from "./Setting";
import Wing from "./Wing";
import Engine from "./Engine";

type ForceArm = {
  force: Vec,
  arm: Vec
}

export default class Plane {

  public pos: Vec;
  public vel: Vec;
  public ang: number;
  public angVel: number;
  public cog: Vec;
  public mass: number = 100;
  public moment: number = 0.033;
  public wings: Wing[] = [];
  public engine: Engine;
  private setting: Setting;


  constructor(pos: Vec, vel: Vec, ang: number, angVel: number, cog: Vec, engine: Engine, setting: Setting) {
    this.pos = pos;
    this.vel = vel;
    this.ang = ang;
    this.angVel = angVel;
    this.cog = cog;
    this.engine = engine;
    this.setting = setting;
  }

  addWing(wing: Wing) {
    this.wings.push(wing);
  }

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

  getAbsWingAngle(wing: Wing): number {
    return wing.ang + this.ang;
  }

  getAirVel(pos: Vec): Vec {
    return this.getAbsVel(pos)
               .minus(this.setting.getWind(pos));
  }

  getWingForceArm(wing: Wing): ForceArm {

    let absWingAngle: number = this.getAbsWingAngle(wing);

    let airVel: Vec = this.getAirVel(wing.pos);

    let wingForce: Vec = wing.getForce(absWingAngle, airVel);

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

  private getAllForceArms(): ForceArm[]{
    let forceArms: ForceArm[] = [
      this.getWeightForceArm(),
      this.getEngineForceArm()
    ];
    this.wings.forEach(wing => {
      forceArms.push(this.getWingForceArm(wing));
    });
    return forceArms;
  }

  private getNetForce(allForceArms: ForceArm[]): Vec {

    let netForce = Vec.n();

    allForceArms.forEach(forceArm => {
      netForce.plus(forceArm.force);
    })

    return netForce;
  }

  private getNetTorque(allForceArms: ForceArm[]): number {
    return this.setting.getRudder() * 0.05; // STUBBED
  }

}