import Vec from "./Vec";

export default class Setting {

  private keysDown: Set<String> = new Set();

  public keyDown(e: KeyboardEvent) {
    this.keysDown.add(e.key);
  }

  public keyUp(e: KeyboardEvent) {
    this.keysDown.delete(e.key);
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