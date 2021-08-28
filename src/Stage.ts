import Vec from "./Vec";

export default class Stage {

  pixelWidth: number = 800;
  pixelHeight: number = 600;
  pixelsPerMeter: number = 10;
  origin: Vec = Vec.n(0, 0); // where bottom left of stage shows in real coords
  svg: SVGSVGElement;

  constructor(containerDiv: HTMLElement) {

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('width', '700');
    svg.setAttribute('height', '500');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    this.svg = svg;

    let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '40');
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('fill', 'red');

    this.svg.appendChild(circle);

    containerDiv.appendChild(this.svg);
  }

  public getPaintPos(realMeterPos: Vec): Vec {
    let stageMeterPos = realMeterPos.subtract(this.origin);
    let stagePixelPos = stageMeterPos.times(this.pixelsPerMeter);
    let PaintPos = Vec.n(stagePixelPos.x, this.pixelHeight - stagePixelPos.y);
    return PaintPos;
  }


}