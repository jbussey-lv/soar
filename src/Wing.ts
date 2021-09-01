import Vec from "./Vec";

export default class Wing {

  public pos: Vec;
  public ang: number;
  public length: number;
  public width: number;
  public mass: number;

  constructor(pos: Vec, ang: number, length: number, width: number, mass: number) {
    this.pos = pos;
    this.ang = ang;
    this.length = length;
    this.width = width;
    this.mass = mass;
  }

  public getForceMagnitude(airSpeed: number, airAngle: number, airDensity: number): number {
    let sinTheta = Math.sin(airAngle);
    return 2 * airSpeed * airSpeed * sinTheta * sinTheta * this.length * airDensity;
  }


}