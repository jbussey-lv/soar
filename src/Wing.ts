import Vec from "./Vec";

export default class Wing {

  private _pos: Vec;
  private _angle: number;
  private _length: number;
  private _mass: number;

  constructor(pos: Vec, angle: number, length: number, mass: number) {
    this._pos = pos;
    this._angle = angle;
    this._length = length;
    this._mass = mass;
  }

  public getForceMagnitude(airSpeed: number, airAngle: number, airDensity: number): number {
    let sinTheta = Math.sin(airAngle);
    return 2 * airSpeed * airSpeed * sinTheta * sinTheta * this._length * airDensity;
  }


}