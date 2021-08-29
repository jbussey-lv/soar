import Vec from "./Vec";

export default class Setting {

  private keysDown: Set<String> = new Set();

  public keyDown(key: String) {
    this.keysDown.add(key);
  }

  public keyUp(key: String) {
    this.keysDown.delete(key);
  }

  public isKeyDown(key: String): boolean {
    return this.keysDown.has(key);
  }

  public g = -9.8;

  private _wind = new Vec(0, 0);

  public wind(position: Vec): Vec {
    return this._wind;
  }




}