import Vec from "./Vec";
import React = require("react");
import ReactDOMServer from "react-dom/server";

export default abstract class Sprite {
  
  abstract get position(): Vec;

  abstract get angle(): number;

  abstract get cog(): Vec;

  abstract get svg(): JSX.Element;

  private get angleInDegrees(): number {
    return this.angle * (180 / Math.PI);
  }

  private get svgTransform(): string {
    let translate = `translate(${this.position.x}, ${this.position.y})`;
    let rotate = `rotate(${this.angleInDegrees}, ${this.cog.x}, ${this.cog.y})`;
    return `${translate} ${rotate}`;
  }

  public render(): string {
    return ReactDOMServer.renderToString(
      <g transform={this.svgTransform} >
        {this.svg}
      </g>
    )
  }
}