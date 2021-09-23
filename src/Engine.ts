import Setting from "./Setting";
import Vec from "./Vec";

export default class Engine {

  public pos: Vec;
  public ang: number;
  public maxThrust: number;
  public setting: Setting;

  constructor(pos: Vec, ang: number, maxThrust: number, setting: Setting) {
    this.pos = pos;
    this.ang = ang;
    this.maxThrust = maxThrust;
    this.setting = setting;
  }

  public get thrust(): number{
    return this.maxThrust * this.setting.getThrust();
  }


}