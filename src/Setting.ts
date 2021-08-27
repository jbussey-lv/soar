import Vec from "./Vec";

export default class Setting {

  private _g = new Vec(0, -9.8);

  private _wind = new Vec(0, 0);

  public g(position: Vec): Vec {
    return this._g;
  }

  public wind(position: Vec): Vec {
    return this._wind;
  }


}