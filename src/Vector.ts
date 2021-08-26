

export default class Vector {

  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  public set magnitude(magnitude: number) {
    let multiplier = magnitude / this.magnitude;
    this.x *= multiplier;
    this.y *= multiplier;
  }

  public get angle(): number {
    return Math.atan2(this.y, this.x);
  }

  // need tests

  public set angle(angle: number) {
    let magnitude = this.magnitude;
    this.x = magnitude * Math.cos(angle);
    this.y = magnitude * Math.sin(angle);
  }

  public add(...vectors: Vector[]): Vector {
    vectors.forEach(vector => {
      this.x += vector.x;
      this.y += vector.y;
    });
    return this;
  }

  public subtract(...vectors: Vector[]): Vector {
    vectors.forEach(vector => {
      this.x -= vector.x;
      this.y -= vector.y;
    });
    return this;
  }

  static sum(vectors: Vector[]): Vector {
    return new Vector().add(...vectors);
  }

}