import Vec from "./Vec";
import Plane from "./Plane";

export default class Stage {

  private pixelWidth: number;
  private pixelHeight: number;
  private pixelsPerMeter: number = 10;
  private origin: Vec = Vec.n(0, 0); // where bottom left of stage shows in real meter coords
  private container: HTMLElement;
  private planes: Map<Plane, SVGElement> = new Map();

  constructor(container: HTMLElement) {
    this.container = container;
    this.setDimensions();
    window.onresize = () => {
      this.setDimensions();
    }
  }

  addPlane(plane: Plane) {

    let sprite: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    sprite.setAttribute('cx', '0');
    sprite.setAttribute('cy', '0');
    sprite.setAttribute('r', '40');
    sprite.setAttribute('stroke', 'black');
    sprite.setAttribute('stroke-width', '3');
    sprite.setAttribute('fill', 'red');
    this.container.appendChild(sprite);

    this.planes.set(plane, sprite);
  }

  render() {
    this.planes.forEach((sprite, plane) => {
      let paintPos = this.getPaintPos(plane.pos);
      sprite.setAttribute('cx', paintPos.x.toString());
      sprite.setAttribute('cy', paintPos.y.toString());
    })
  }


  private setDimensions(){
    let style = window.getComputedStyle(this.container, null);

    var horizontalPadding = parseFloat(style.paddingLeft) +
                            parseFloat(style.paddingRight);

    var verticalPadding = parseFloat(style.paddingTop) +
                            parseFloat(style.paddingBottom);

    this.pixelWidth = this.container.clientWidth -  horizontalPadding;
    this.pixelHeight = this.container.clientHeight - verticalPadding;
  }

  public getPaintPos(realMeterPos: Vec): Vec {
    let stageMeterPos = realMeterPos.subtract(this.origin);
    let stagePixelPos = stageMeterPos.times(this.pixelsPerMeter);
    let PaintPos = Vec.n(stagePixelPos.x, this.pixelHeight - stagePixelPos.y);
    return PaintPos;
  }


}