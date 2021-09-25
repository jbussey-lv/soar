import Vec from "./Vec";
import Plane from "./Plane";
import Wing from "./Wing";
import Engine from "./Engine";
import { ForceArm } from "./ForceArm";

type PlaneGroup = {
  group: SVGElement;
  wingSprites: SVGElement[];
  engineSprites: SVGElement[];
  forceSprites: SVGElement[];
}

export default class Stage {

  private pixelWidth: number;
  private pixelHeight: number;
  private pixelsPerMeter: number = 4;
  private metersPerNewton: number = 0.2;  // to draw force vectors
  private origin: Vec = Vec.n(0, 0); // where bottom left of stage shows in real meter coords
  private container: HTMLElement;
  private planes: Map<Plane, PlaneGroup> = new Map();
  private debug: boolean = false;


  constructor(container: HTMLElement, debug: boolean = false) {
    this.container = container;
    this.debug = debug;
    this.setDimensions();
    window.onresize = () => {
      this.setDimensions();
    }
    this.addSky();
  }

  private createSvgElement(type: String): SVGElement {
    return document.createElementNS("http://www.w3.org/2000/svg", type+"");
  }

  addSky() {
    let height = 60;
    let start = Vec.n(0, height);
    let paintStart = this.getPaintPos(start);

    let line: SVGElement = this.createSvgElement('line');
    line.setAttribute("x1", paintStart.x.toString());
    line.setAttribute("y1", paintStart.y.toString());
    line.setAttribute("x2", this.pixelWidth.toString());
    line.setAttribute("y2", paintStart.y.toString());
    line.setAttribute('stroke', 'grey');
    line.setAttribute('stroke-width', '1');
    this.container.appendChild(line);

  }

  addRect(plane: Plane, group: SVGElement){

    let width = 10;
    let height = 4;

    let rect: SVGElement = this.createSvgElement('rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', (-1 * height *this.pixelsPerMeter).toString());
    rect.setAttribute('width', (width*this.pixelsPerMeter).toString());
    rect.setAttribute('height', (height*this.pixelsPerMeter).toString());
    rect.setAttribute('stroke', 'grey');
    rect.setAttribute('stroke-width', '2');
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

    if(this.debug){
      this.addRect(plane, group);
    }

    group.appendChild(this.getCogSprite(plane.cog));

    let wingSprites: SVGElement[] = [];
    plane.wings.forEach(wing => {
      let wingSprite = this.getWingSprite(wing);
      group.appendChild(wingSprite);
      wingSprites.push(wingSprite);
    });

    let engineSprites: SVGElement[] = [];
    plane.engines.forEach(engine => {
      let engineSprite = this.getEngineSprite(engine);
      group.appendChild(engineSprite);
      engineSprites.push(engineSprite);
    });

    let forceSprites: SVGElement[] = [];
    if(this.debug){
      plane.getAllForceArms().forEach(forceArm => {
        let forceSprite = this.getForceSprite();
        this.container.appendChild(forceSprite);
        forceSprites.push(forceSprite);
      })
    }

    this.container.appendChild(group);

    this.planes.set(plane, {group: group, wingSprites, engineSprites, forceSprites});
  }

  getCogSprite(cog: Vec): SVGElement {
    let cogSprite: SVGElement = this.createSvgElement('circle');
    cogSprite.setAttribute("cx", (cog.x * this.pixelsPerMeter).toString());
    cogSprite.setAttribute("cy", (-1 * cog.y * this.pixelsPerMeter).toString());
    cogSprite.setAttribute("r", (0.5 * this.pixelsPerMeter).toString());
    cogSprite.setAttribute('stroke', 'green');
    cogSprite.setAttribute('fill', 'green');
    return cogSprite;
  }

  getForceSprite(): SVGElement {
    let forceSprite: SVGElement = this.createSvgElement('line');

    forceSprite.setAttribute("stroke", "#000");
    forceSprite.setAttribute("stroke-width", "2");
    forceSprite.setAttribute("marker-end", "url(#arrowhead)");

    return forceSprite;
  }

  getWingSprite(wing: Wing): SVGElement {
    let wingSprite: SVGElement = this.createSvgElement('line');
    let x1 = (wing.pos.x - wing.width / 2) * this.pixelsPerMeter;
    let y1 = -1 * wing.pos.y * this.pixelsPerMeter;
    let x2 = (wing.pos.x + wing.width / 2) * this.pixelsPerMeter;
    let y2 = (-1 * wing.pos.y * this.pixelsPerMeter)
    let cx = (x2 + x1) / 2;
    let cy = (y2 + y1) / 2;
    wingSprite.setAttribute("x1", x1.toString());
    wingSprite.setAttribute("y1", y1.toString());
    wingSprite.setAttribute("x2", x2.toString());
    wingSprite.setAttribute("y2", y2.toString());
    wingSprite.setAttribute('stroke', 'red');
    wingSprite.setAttribute('stroke-width', '3');
    let rotate = " rotate(" + wing.ang * -180 / Math.PI + " " + cx + " " + cy + ")";

    wingSprite.setAttribute("transform", rotate);
    return wingSprite;
  }

  getEngineSprite(engine: Engine){

    let radius = 0.5;
    
    let engineSprite: SVGElement = this.createSvgElement('circle');
    engineSprite.setAttribute("cx", (engine.pos.x * this.pixelsPerMeter).toString());
    engineSprite.setAttribute("cy", (-1 * engine.pos.y * this.pixelsPerMeter).toString());
    engineSprite.setAttribute("r", (radius * this.pixelsPerMeter).toString());
    engineSprite.setAttribute('stroke', 'blue');
    engineSprite.setAttribute('fill', 'blue');

    return engineSprite;
  }

  render() {
    this.planes.forEach((sprite, plane) => {
      plane.wings.forEach((wing, i) => {
        let wingSprite = sprite.wingSprites[i];
        let x1 = (wing.pos.x - wing.width / 2) * this.pixelsPerMeter;
        let y1 = -1 * wing.pos.y * this.pixelsPerMeter;
        let x2 = (wing.pos.x + wing.width / 2) * this.pixelsPerMeter;
        let y2 = (-1 * wing.pos.y * this.pixelsPerMeter)
        let cx = (x2 + x1) / 2;
        let cy = (y2 + y1) / 2;
        this.setAng(wingSprite, wing.ang, cx, cy);
      });
      if(this.debug){
        plane.getAllForceArms().forEach((forceArm, i) => {
          let forceSprite = sprite.forceSprites[i];
          let start = plane.pos.plus(plane.cog, forceArm.arm);
          let end = start.plus(forceArm.force.times(this.metersPerNewton));
  
          let startPaintPos = this.getPaintPos(start);
          let endPaintPos = this.getPaintPos(end);
  
          let visibility = Math.abs(forceArm.force.magnitude) > 0.1 ?
                           "visible" :
                           "hidden";
  
          forceSprite.setAttribute("x1", startPaintPos.x.toString());
          forceSprite.setAttribute("y1", (startPaintPos.y).toString());
          forceSprite.setAttribute("x2", endPaintPos.x.toString());
          forceSprite.setAttribute("y2", (endPaintPos.y).toString());
          forceSprite.setAttribute("visibility", visibility);
        });
      }


      let paintPos = this.getPaintPos(plane.pos);
      let translate = " translate(" + paintPos.x + " " + paintPos.y + ")";
      let rotate = " rotate("+ this.decimalize(plane.ang * -180 / Math.PI) + " " + this.decimalize(plane.cog.x * this.pixelsPerMeter) + " " + this.decimalize(-1 * plane.cog.y * this.pixelsPerMeter) + ")";
      sprite.group.setAttribute("transform", translate + rotate);
    })
  }

  private decimalize(number: number): String {
    if(-0.00001 < number && number < 0.00001){
      number = 0;
    }
    return number.toFixed(5);
  }

  private setAng(element: SVGElement, ang: number, cx: number, cy: number) {
    let rotate = " rotate(" + this.decimalize(ang * -180 / Math.PI) + " " + this.decimalize(cx) + " " + this.decimalize(cy) + ")";
    element.setAttribute("transform", rotate);
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