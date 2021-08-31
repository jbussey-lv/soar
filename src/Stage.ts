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

    let sprite: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    let circle: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    circle.setAttribute('cx', '0');
    circle.setAttribute('cy', '0');
    circle.setAttribute('r', '40');
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('fill', 'red');
    sprite.appendChild(circle);



    let circle2: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    circle2.setAttribute('cx', '20');
    circle2.setAttribute('cy', '-30');
    circle2.setAttribute('r', '40');
    circle2.setAttribute('stroke', 'black');
    circle2.setAttribute('stroke-width', '3');
    circle2.setAttribute('fill', 'red');
    sprite.appendChild(circle2);

    this.container.appendChild(sprite);

    this.planes.set(plane, sprite);
  }

  render() {
    this.planes.forEach((sprite, plane) => {
      let paintPos = this.getPaintPos(plane.pos);
      let translate = " translate(" + paintPos.x + " " + paintPos.y + ")";
      let rotate = " rotate("+ plane.ang * 180 / Math.PI + " " + plane.cog.x * this.pixelsPerMeter + " " + -1 * plane.cog.y * this.pixelsPerMeter + ")";
      sprite.setAttribute("transform", translate + rotate);
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
    let stageMeterPos = realMeterPos.minus(this.origin);
    let stagePixelPos = stageMeterPos.times(this.pixelsPerMeter);
    let PaintPos = Vec.n(stagePixelPos.x, this.pixelHeight - stagePixelPos.y);
    return PaintPos;
  }


}