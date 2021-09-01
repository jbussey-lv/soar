import Vec from "./Vec";
import Plane from "./Plane";
import Wing from "./Wing";
import { addSyntheticTrailingComment } from "typescript";


type PlaneGroup = {
  group: SVGElement;
  wingSprites: SVGElement[];
}

export default class Stage {


  private pixelWidth: number;
  private pixelHeight: number;
  private pixelsPerMeter: number = 30;
  private origin: Vec = Vec.n(0, 0); // where bottom left of stage shows in real meter coords
  private container: HTMLElement;
  private planes: Map<Plane, PlaneGroup> = new Map();


  constructor(container: HTMLElement) {
    this.container = container;
    this.setDimensions();
    window.onresize = () => {
      this.setDimensions();
    }
  }

  private createSvgElement(type: String): SVGElement {
    return document.createElementNS("http://www.w3.org/2000/svg", type+"");
  }

  addRect(width: number, height: number, group: SVGElement){

    let rect: SVGElement = this.createSvgElement('rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', (-1 * height *this.pixelsPerMeter).toString());
    rect.setAttribute('width', (width*this.pixelsPerMeter).toString());
    rect.setAttribute('height', (height*this.pixelsPerMeter).toString());
    rect.setAttribute('stroke', 'black');
    rect.setAttribute('stroke-width', '3');
    rect.setAttribute('fill', 'transparent');
    group.appendChild(rect);

    for(let i = 1; i < width; i++){
      let line: SVGElement = this.createSvgElement('line');
      line.setAttribute("x1", (i * this.pixelsPerMeter).toString());
      line.setAttribute("y1", '0');
      line.setAttribute("x2", (i * this.pixelsPerMeter).toString());
      line.setAttribute("y2", (-1 * height * this.pixelsPerMeter).toString());
      line.setAttribute('stroke', 'grey');
      line.setAttribute('stroke-width', '1');
      group.appendChild(line);
    }

    for(let i = 1; i < height; i++){
      let line: SVGElement = this.createSvgElement('line');
      line.setAttribute("x1", '0');
      line.setAttribute("y1", (-1 * i * this.pixelsPerMeter).toString());
      line.setAttribute("x2", (width * this.pixelsPerMeter).toString());
      line.setAttribute("y2", (-1 * i * this.pixelsPerMeter).toString());
      line.setAttribute('stroke', 'grey');
      line.setAttribute('stroke-width', '1');
      group.appendChild(line);
    }
  }

  addPlane(plane: Plane) {

    let group: SVGElement = this.createSvgElement('g');

    let width = 20;
    let height = 10;
    this.addRect(width, height, group);

    // let circle: SVGElement = this.createSvgElement('circle');
    // circle.setAttribute('cx', '0');
    // circle.setAttribute('cy', '0');
    // circle.setAttribute('r', '40');
    // circle.setAttribute('stroke', 'black');
    // circle.setAttribute('stroke-width', '3');
    // circle.setAttribute('fill', 'red');
    // group.appendChild(circle);

    // let circle2: SVGElement = this.createSvgElement('circle');
    // circle2.setAttribute('cx', '80');
    // circle2.setAttribute('cy', '-30');
    // circle2.setAttribute('r', '40');
    // circle2.setAttribute('stroke', 'black');
    // circle2.setAttribute('stroke-width', '3');
    // circle2.setAttribute('fill', 'red');
    // group.appendChild(circle2);

    let wingSprites: SVGElement[] = [];
    plane.wings.forEach(wing => {
      let wingSprite = this.getWingSprite(wing);
      group.appendChild(wingSprite);
      wingSprites.push(wingSprite);
    })


    this.container.appendChild(group);

    this.planes.set(plane, {group: group, wingSprites: []});
  }

  getWingSprite(wing: Wing){
    let wingSprite: SVGElement = this.createSvgElement('line');
    let x1 = (wing.pos.x - wing.width / 2) * this.pixelsPerMeter;
    let y1 = -1 * wing.pos.y * this.pixelsPerMeter;
    let x2 = (wing.pos.x + wing.width / 2) * this.pixelsPerMeter;
    let y2 = (-1 * wing.pos.y * this.pixelsPerMeter)
    let cx = (x2 + x1) / 2;
    let cy = (y2 + y1) / 2;
    console.log(cx +", " + cy);
    wingSprite.setAttribute("x1", x1.toString());
    wingSprite.setAttribute("y1", y1.toString());
    wingSprite.setAttribute("x2", x2.toString());
    wingSprite.setAttribute("y2", y2.toString());
    wingSprite.setAttribute('stroke', 'red');
    wingSprite.setAttribute('stroke-width', '3');
    let rotate = " rotate(" + wing.ang * -180 / Math.PI + " " + cx + " " + cy + ")";
    // let rotate = " rotate(" + wing.ang * 180 / Math.PI + " " + cx * this.pixelsPerMeter + " " + -1 * cy * this.pixelsPerMeter + ")";
    // + " " + cx * this.pixelsPerMeter + " " + -1 * cy * this.pixelsPerMeter + ")";
    wingSprite.setAttribute("transform", rotate);
    return wingSprite;
  }

  render() {
    this.planes.forEach((sprite, plane) => {
      let paintPos = this.getPaintPos(plane.pos);
      let translate = " translate(" + paintPos.x + " " + paintPos.y + ")";
      let rotate = " rotate("+ plane.ang * 180 / Math.PI + " " + plane.cog.x * this.pixelsPerMeter + " " + -1 * plane.cog.y * this.pixelsPerMeter + ")";
      sprite.group.setAttribute("transform", translate + rotate);
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