import Vec from "./Vec";

export default class Stage {

  pixelWidth: number = 800;
  pixelHeight: number = 600;
  pixelsPerMeter: number = 10;
  origin: Vec = Vec.n(0, 0); // where bottom left of stage shows in real coords
  svg: HTMLElement;

  constructor(containerDiv: HTMLElement) {
    this.svg = document.createElement('SVG');
    this.svg.setAttribute('style', 'border: 1px solid black');
    this.svg.setAttribute('width', '600');
    this.svg.setAttribute('height', '250');
    this.svg.setAttribute('version', '1.1');
    this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    containerDiv.appendChild(this.svg);
  }

  public getPaintPos(realMeterPos: Vec): Vec {
    let stageMeterPos = realMeterPos.subtract(this.origin);
    let stagePixelPos = stageMeterPos.times(this.pixelsPerMeter);
    let PaintPos = Vec.n(stagePixelPos.x, this.pixelHeight - stagePixelPos.y);
    return PaintPos;
  }


}