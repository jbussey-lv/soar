

export default class Vec {

  private _x: number;
  private _y: number;

  constructor(x: number = 0, y: number = 0) {
    this._x = x;
    this._y = y;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  private set magnitude(magnitude: number) {
    let multiplier = magnitude / this.magnitude;
    this._x *= multiplier;
    this._y *= multiplier;
  }

  public get angle(): number {
    return Math.atan2(this.y, this.x);
  }

  private set angle(a: number) {
    let magnitude = this.magnitude;
    this._x = magnitude * Math.cos(a);
    this._y = magnitude * Math.sin(a);
  }

  public times(factor: number): Vec {
    let response: Vec = this.clone();
    response.magnitude *= factor;
    return response;
  }

  public divide(dividend: number): Vec {
    let response: Vec = this.clone();
    response.magnitude /= dividend;
    return response;
  }

  public add(...vectors: Vec[]): Vec {
    let response: Vec = this.clone();
    vectors.forEach(vector => {
      response._x += vector.x;
      response._y += vector.y;
    });
    return response;
  }

  public subtract(...vectors: Vec[]): Vec {
    let response: Vec = this.clone();
    vectors.forEach(vector => {
      response._x -= vector.x;
      response._y -= vector.y;
    });
    return response;
  }

  public rotate(angle: number): Vec {
    let response: Vec = this.clone();
    response.angle += angle;
    return response;
  }

  public clone(): Vec {
    return new Vec(this.x, this.y);
  }

  static sum(...vectors: Vec[]): Vec {
    return new Vec().add(...vectors);
  }

  static n(x: number = 0, y: number = 0): Vec {
    return new Vec(x, y);
  }
}