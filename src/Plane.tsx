import React = require("react");
import Sprite from "./Sprite";
import Vec from "./Vec";

export default class Plane extends Sprite {

  private _cog = Vec.n(3, 2);
  private _position = Vec.n(20, 10)
  private _width = 200;
  private _height = 100;

  get cog(){
    return this._cog;
  }

  get position(){
    return this._position
  }

  get angle() {
    return Math.PI / 6;
  }

  get svg(){
    let style = {
      fill: "rgb(0,0,255)",
      strokeWidth: 3,
      stroke: "rgb(0,0,0)"
    };

    return (
      <rect width={this._width} height={this._height} style={style} />
    )
  }





}