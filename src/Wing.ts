import Setting from "./Setting";
import Vec from "./Vec";

export default class Wing {

  public pos: Vec;
  public angMid: number;
  public angDiff: number;
  public length: number;
  public width: number;
  public getControlVal: () => number;

  constructor(pos: Vec, angMid: number, angDiff: number, length: number, width: number, getControlVal: () => number) {
    this.pos = pos;
    this.angMid = angMid;
    this.angDiff = angDiff;
    this.length = length;
    this.width = width;
    this.getControlVal = getControlVal;
  }

  public getForce(absWingAngle: number, airVel: Vec, airDensity: number): Vec {

    let AoA: number = absWingAngle - airVel.angle;

    let forceMagnitude: number = this.getForceMagnitude(airVel.magnitude, AoA, airDensity);

    let forceAngle: number = absWingAngle + Math.PI/2;

    return Vec.n(forceMagnitude).rotate(forceAngle);

  }

  public getForceMagnitude(airSpeed: number, AoA: number, airDensity: number): number {
    let sinTheta = Math.sin(AoA);
    return 2 * airSpeed * airSpeed * sinTheta * sinTheta * this.length * this.width * airDensity;
  }

  public get ang(): number{
    return this.angMid + (this.angDiff * this.getControlVal());
  }

  


}