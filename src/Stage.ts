import Vec from "./Vec";

export default class Stage {

  pixelWidth: number;
  pixelHeight: number;
  pixelsPerMeter: number = 10;
  origin: Vec = Vec.n(0, 0); // where bottom left of stage shows in real meter coords
  stage: HTMLElement;

  constructor(stage: HTMLElement) {

    this.stage = stage;
    this.setDimensions();
    window.onresize = () => {
      this.setDimensions();
    }
  }

  private setDimensions(){
    let style = window.getComputedStyle(this.stage, null);

    var horizontalPadding = parseFloat(style.paddingLeft) +
                            parseFloat(style.paddingRight);

    var verticalPadding = parseFloat(style.paddingTop) +
                            parseFloat(style.paddingBottom);

    this.pixelWidth = this.stage.clientWidth -  horizontalPadding;
    this.pixelHeight = this.stage.clientHeight - verticalPadding;
  }

  public getPaintPos(realMeterPos: Vec): Vec {
    let stageMeterPos = realMeterPos.subtract(this.origin);
    let stagePixelPos = stageMeterPos.times(this.pixelsPerMeter);
    let PaintPos = Vec.n(stagePixelPos.x, this.pixelHeight - stagePixelPos.y);
    return PaintPos;
  }


}