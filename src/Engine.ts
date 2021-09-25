import Setting from "./Setting";
import Vec from "./Vec";

export default class Engine {

  public pos: Vec;
  public ang: number;
  public maxThrust: number;
  public getControlVal: () => number;

  constructor(pos: Vec, ang: number, maxThrust: number, getControlVal: () => number) {
    this.pos = pos;
    this.ang = ang;
    this.maxThrust = maxThrust;
    this.getControlVal = getControlVal;
  }

  public get thrust(): number{
    let response = this.maxThrust * this.getControlVal();
    console.log(response);
    return this.maxThrust * this.getControlVal();
  }


}