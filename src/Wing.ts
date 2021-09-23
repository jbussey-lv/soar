import Setting from "./Setting";
import Vec from "./Vec";

export default class Wing {

  public pos: Vec;
  public angMid: number;
  public angDiff: number;
  public control: string;
  public length: number;
  public width: number;
  public setting: Setting;

  constructor(pos: Vec, angMid: number, angDiff: number, control: string, length: number, width: number, setting: Setting) {
    this.pos = pos;
    this.angMid = angMid;
    this.angDiff = angDiff;
    this.control = control;
    this.length = length;
    this.width = width;
    this.setting = setting;
  }

  public getLiftMagnitude(AoA: number, airSpeed: number): number {
    let sinTheta: number = Math.sin(AoA);
    return 2 * this.width * this.length * this.setting.airDensity * sinTheta * sinTheta * airSpeed;
  }

  public get ang(): number{
    return this.angMid + (this.angDiff * this.setting.getElevator());
  }

  public getLift(absAng: number, airVel: Vec): Vec {
    let AoA: number = absAng - airVel.angle;
    let liftMag: number = this.getLiftMagnitude(AoA, airVel.magnitude);
    let liftAng: number = absAng + Math.PI / 2;
    return Vec.n(liftMag).rotate(liftAng);
  }

  


}