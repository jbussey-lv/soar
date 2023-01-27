import React = require("react");
import Sprite from "./Sprite";
import Vec from "./Vec";

export default class SimpleSprite extends Sprite {

  public cog: Vec;
  public position: Vec;
  public angle: number;
  public svg: JSX.Element;

  constructor(cog: Vec, position: Vec, angle: number, svg: JSX.Element) {
    super();
    this.cog = cog;
    this.position = position;
    this.angle = angle;
    this.svg = svg;
  }
}





}