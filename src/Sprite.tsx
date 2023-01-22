import Vec from "./Vec";
import React = require("react");

abstract class Sprite {
  
  abstract get position(): Vec;

  abstract get angle(): number;

  abstract get svg(): JSX.Element;

  private get angleInDegrees(): number {
    return this.angle * (180 / Math.PI);
  }

  private get svgTransform(): string {
    return `translate(${this.position.x},${this.position.y}) rotate(${this.angleInDegrees})`;
  }

  render(): JSX.Element {
    return (
      <g transform={this.svgTransform} >
        {this.svg}
      </g>
    )
  }
}