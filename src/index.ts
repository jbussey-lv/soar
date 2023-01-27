import ReactDOMServer from "react-dom/server";
import Plane from "./Plane";

let sprites = [
  new Plane(20, 30),
  new Plane(100, 130),
  new Plane(400, 200)
];

let content = "";
for(let sprite of sprites){
  content += ReactDOMServer.renderToString(sprite.render())
}

document.getElementById("stage").innerHTML = content;
