import Vec from "./Vec";
import React = require("react");

abstract class Sprite {
  
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

  render(): JSX.Element {
    return (
      <g transform={this.svgTransform} >
        {this.svg}
      </g>
    )
  }
}