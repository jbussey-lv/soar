import Vector from "./Vector";

export default class Plane {

  public position: Vector;
  public velocity: Vector;
  public mass: number;

  constructor(position: Vector = new Vector(), velocity: Vector = new Vector(), mass: number = 0) {
    this.position = position;
    this.velocity = velocity;
    this.mass = mass;
  }

  updatePoisition(dt: number) {
    let acceleration = this.netForce.divide(this.mass);
    this.velocity.add(acceleration.multiply(dt))
    this.position.add(this.velocity.clone().multiply(dt));
  }

  private get netForce(): Vector {
    return new Vector(4,3);
  }


}