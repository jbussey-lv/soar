import Setting from "./Setting";
import Vec from "./Vec";

export default class Wing {

  public pos: Vec;
  public angMid: number;
  public angDiff: number;
  public control: string;
  public length: number;
  public width: number;
  public mass: number;
  public setting: Setting;

  constructor(pos: Vec, angMid: number, angDiff: number, control: string, length: number, width: number, mass: number, setting: Setting) {
    this.pos = pos;
    this.angMid = angMid;
    this.angDiff = angDiff;
    this.control = control;
    this.length = length;
    this.width = width;
    this.mass = mass;
    this.setting = setting;
  }

  public getForceMagnitude(airSpeed: number, airAngle: number, airDensity: number): number {
    let sinTheta = Math.sin(airAngle);
    return 2 * airSpeed * airSpeed * sinTheta * sinTheta * this.length * airDensity;
  }

  public get ang(): number{
    return this.angMid + (this.angDiff * this.setting.getElevator());
  }


}