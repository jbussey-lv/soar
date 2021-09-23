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
    let acc = this.netForce.divide(this.mass);
    this.vel = this.vel.plus(acc.times(dt))
    this.pos = this.pos.plus(this.vel.times(dt));

    let angAcc = this.netTorque / this.moment;
    this.angVel += angAcc * dt;
    this.ang += this.angVel * dt;
  }

  getAbsPos(pos: Vec) {
    return pos.minus(this.cog)
              .rotate(this.ang)
              .plus(this.pos);
  }

  getAbsVel(pos: Vec): Vec {

    let rawArm: Vec = pos.minus(this.cog);
    let norArm: Vec = rawArm.rotate(this.ang);
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

    let wingForce: Vec = wing.getLift(absWingAngle, airVel);

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
    let arm = this.engine.pos.minus(this.cog);
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

  private get netForce(allForceArms: ForceArm[]): Vec {

    let netForce = Vec.n();

    allForceArms.forEach(forceArm => {
      netForce.plus(forceArm.force);
    })

    return netForce;
  }

  private get netTorque(allForceArms: ForceArm[]): number {
    return this.setting.getRudder() * 0.05; // STUBBED
  }

  // private getLift(): Vec {
  //   let lift: Vec = new Vec();
  //   this.wings.forEach(wing => {
  //     lift.plus(this.getWingForce(wing));
  //   });
  //   return lift;
  // }

  private getThrustForceArms: ForceArm[] {
    return {
      force: getThrust(),

    }
  }

  private getThrust(): Vec {

    let gMag = this.mass * this.setting.g;
    return Vec.n(
      -2 * gMag * this.setting.getAilerons(), 
      2 * gMag * this.setting.getElevator()
    );
  }


}