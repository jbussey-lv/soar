import Vec from "./Vec";

export default class Stage {

  pixelWidth: number = 800;
  pixelHeight: number = 600;
  pixelsPerMeter: number = 10;
  origin: Vec = Vec.n(0, 0); // where bottom left of stage shows in real coords

  public getPaintPos(realMeterPos: Vec): Vec {
    let stageMeterPos = realMeterPos.subtract(this.origin);
    let stagePixelPos = stageMeterPos.times(this.pixelsPerMeter);
    let PaintPos = Vec.n(stagePixelPos.x, this.pixelHeight - stagePixelPos.y);
    return PaintPos;
  }


}