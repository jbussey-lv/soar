import Vec from "./Vec";

export default class Setting {

  private keysDown: Set<String> = new Set();
  private gamepad: Gamepad;

  public setGamepad(gamepad: Gamepad) {
    this.gamepad = gamepad;
  }

  public getThrust(): number{
    if(!this.gamepad){return 0};
    return this.gamepad.axes[1];
  }

  public getElevator(): number {
    if(!this.gamepad){return 0};
    return this.gamepad.axes[3];
  }

  public getAilerons(): number {
    if(!this.gamepad){return 0};
    return this.gamepad.axes[2];
  }

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

  public wind(position: Vec): Vec {
    return Vec.n();
  }




}