/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AbstractObject.ts":
/*!*******************************!*\
  !*** ./src/AbstractObject.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vec_1 = __importDefault(__webpack_require__(/*! ./Vec */ "./src/Vec.ts"));
class AbstractObject {
    constructor(pos, vel, ang, angVel, cog, setting) {
        this.mass = 10;
        this.moment = 300;
        this.mod = function (number, base) {
            return ((number % base) + base) % base;
        };
        this.pos = pos;
        this.vel = vel;
        this.ang = ang;
        this.angVel = angVel;
        this.cog = cog;
        this.setting = setting;
    }
    getAirVel(pos) {
        return this.getAbsVel(pos)
            .minus(this.setting.getWind(this.getAbsPos(pos)));
    }
    updatePosition(dt) {
        let forceArms = this.getAllForceArms();
        let acc = this.getNetForce(forceArms).divide(this.mass);
        this.vel = this.vel.plus(acc.times(dt));
        this.pos = this.pos.plus(this.vel.times(dt));
        let angAcc = this.getNetTorque(forceArms) / this.moment;
        this.angVel += angAcc * dt;
        this.ang = this.mod(this.ang + this.angVel * dt, 2 * Math.PI);
        if (isNaN(this.angVel) || isNaN(this.ang)) {
            return 'Not a Number!';
        }
    }
    getArm(pos) {
        return pos.minus(this.cog)
            .rotate(this.ang);
    }
    getAbsPos(pos) {
        return this.getArm(pos)
            .plus(this.pos);
    }
    getAbsVel(pos) {
        let norArm = this.getArm(pos);
        let velMag = norArm.magnitude * this.angVel;
        let velAng = norArm.angle + Math.PI / 2;
        let relVel = Vec_1.default.n(velMag).rotate(velAng);
        let absVel = relVel.plus(this.vel);
        return absVel;
    }
    getNetForce(allForceArms) {
        let netForce = Vec_1.default.n();
        allForceArms.forEach(forceArm => {
            netForce.x += forceArm.force.x;
            netForce.y += forceArm.force.y;
        });
        return netForce;
    }
    getNetTorque(allForceArms) {
        let netTorque = 0;
        allForceArms.forEach(forceArm => {
            netTorque += this.getTorque(forceArm);
        });
        return netTorque;
    }
    getTorque(forceArm) {
        let theta = forceArm.force.angle - forceArm.arm.angle;
        return forceArm.force.magnitude *
            forceArm.arm.magnitude *
            Math.sin(theta);
    }
}
exports.default = AbstractObject;


/***/ }),

/***/ "./src/Engine.ts":
/*!***********************!*\
  !*** ./src/Engine.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Engine {
    constructor(pos, ang, maxThrust, getControlVal) {
        this.pos = pos;
        this.ang = ang;
        this.maxThrust = maxThrust;
        this.getControlVal = getControlVal;
    }
    get thrust() {
        return this.maxThrust * this.getControlVal();
    }
}
exports.default = Engine;


/***/ }),

/***/ "./src/Plane.ts":
/*!**********************!*\
  !*** ./src/Plane.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vec_1 = __importDefault(__webpack_require__(/*! ./Vec */ "./src/Vec.ts"));
const AbstractObject_1 = __importDefault(__webpack_require__(/*! ./AbstractObject */ "./src/AbstractObject.ts"));
class Plane extends AbstractObject_1.default {
    constructor(pos, vel, ang, angVel, cog, setting) {
        super(pos, vel, ang, angVel, cog, setting);
        this.wings = [];
        this.engines = [];
    }
    addWing(wing) {
        this.wings.push(wing);
    }
    addEngine(engine) {
        this.engines.push(engine);
    }
    getAbsWingAngle(wing) {
        return wing.ang + this.ang;
    }
    getWingForceArm(wing) {
        let absWingAngle = this.getAbsWingAngle(wing);
        let airVel = this.getAirVel(wing.pos);
        let wingForce = wing.getForce(absWingAngle, airVel, this.setting.airDensity);
        return {
            force: wingForce,
            arm: this.getArm(wing.pos)
        };
    }
    getWeightForceArm() {
        let force = Vec_1.default.n(0, this.mass * this.setting.g);
        return {
            force,
            arm: Vec_1.default.n(0, 0)
        };
    }
    getEngineForceArm(engine) {
        let force = Vec_1.default.n(engine.thrust).rotate(engine.ang).rotate(this.ang);
        let arm = this.getArm(engine.pos);
        return { force, arm };
    }
    getAllForceArms() {
        let forceArms = [this.getWeightForceArm()];
        this.engines.forEach(engine => {
            forceArms.push(this.getEngineForceArm(engine));
        });
        this.wings.forEach(wing => {
            forceArms.push(this.getWingForceArm(wing));
        });
        return forceArms;
    }
}
exports.default = Plane;


/***/ }),

/***/ "./src/Setting.ts":
/*!************************!*\
  !*** ./src/Setting.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vec_1 = __importDefault(__webpack_require__(/*! ./Vec */ "./src/Vec.ts"));
class Setting {
    constructor() {
        this.keysDown = new Set();
        this.g = -9.8;
        this.airDensity = 1.225;
    }
    setGamepad(gamepad) {
        this.gamepad = gamepad;
    }
    getRudder() {
        if (!this.gamepad) {
            return 0;
        }
        ;
        return this.gamepad.axes[0];
    }
    getThrust() {
        if (!this.gamepad) {
            return 0;
        }
        ;
        return -1 * this.gamepad.axes[1];
    }
    getAilerons() {
        if (!this.gamepad) {
            return 0;
        }
        ;
        return this.gamepad.axes[2];
    }
    getElevator() {
        if (!this.gamepad) {
            return 0;
        }
        ;
        return -1 * this.gamepad.axes[3];
    }
    keyDown(key) {
        this.keysDown.add(key);
    }
    keyUp(key) {
        this.keysDown.delete(key);
    }
    isKeyDown(key) {
        return this.keysDown.has(key);
    }
    getWind(pos) {
        if (pos.y < 60) {
            return Vec_1.default.n();
        }
        else {
            return Vec_1.default.n(-9, 0);
        }
    }
}
exports.default = Setting;


/***/ }),

/***/ "./src/Stage.ts":
/*!**********************!*\
  !*** ./src/Stage.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vec_1 = __importDefault(__webpack_require__(/*! ./Vec */ "./src/Vec.ts"));
class Stage {
    constructor(container, debug = false) {
        this.pixelsPerMeter = 4;
        this.metersPerNewton = 0.2; // to draw force vectors
        this.origin = Vec_1.default.n(0, 0); // where bottom left of stage shows in real meter coords
        this.planes = new Map();
        this.debug = false;
        this.container = container;
        this.debug = debug;
        this.setDimensions();
        window.onresize = () => {
            this.setDimensions();
        };
        this.addSky();
    }
    createSvgElement(type) {
        return document.createElementNS("http://www.w3.org/2000/svg", type + "");
    }
    addSky() {
        let height = 60;
        let start = Vec_1.default.n(0, height);
        let paintStart = this.getPaintPos(start);
        let line = this.createSvgElement('line');
        line.setAttribute("x1", paintStart.x.toString());
        line.setAttribute("y1", paintStart.y.toString());
        line.setAttribute("x2", this.pixelWidth.toString());
        line.setAttribute("y2", paintStart.y.toString());
        line.setAttribute('stroke', 'grey');
        line.setAttribute('stroke-width', '1');
        this.container.appendChild(line);
    }
    addRect(plane, group) {
        let width = 10;
        let height = 4;
        let rect = this.createSvgElement('rect');
        rect.setAttribute('x', '0');
        rect.setAttribute('y', (-1 * height * this.pixelsPerMeter).toString());
        rect.setAttribute('width', (width * this.pixelsPerMeter).toString());
        rect.setAttribute('height', (height * this.pixelsPerMeter).toString());
        rect.setAttribute('stroke', 'grey');
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('fill', 'transparent');
        group.appendChild(rect);
        for (let i = 1; i < width; i++) {
            let line = this.createSvgElement('line');
            line.setAttribute("x1", (i * this.pixelsPerMeter).toString());
            line.setAttribute("y1", '0');
            line.setAttribute("x2", (i * this.pixelsPerMeter).toString());
            line.setAttribute("y2", (-1 * height * this.pixelsPerMeter).toString());
            line.setAttribute('stroke', 'grey');
            line.setAttribute('stroke-width', '1');
            group.appendChild(line);
        }
        for (let i = 1; i < height; i++) {
            let line = this.createSvgElement('line');
            line.setAttribute("x1", '0');
            line.setAttribute("y1", (-1 * i * this.pixelsPerMeter).toString());
            line.setAttribute("x2", (width * this.pixelsPerMeter).toString());
            line.setAttribute("y2", (-1 * i * this.pixelsPerMeter).toString());
            line.setAttribute('stroke', 'grey');
            line.setAttribute('stroke-width', '1');
            group.appendChild(line);
        }
    }
    addPlane(plane) {
        let group = this.createSvgElement('g');
        if (this.debug) {
            this.addRect(plane, group);
        }
        group.appendChild(this.getCogSprite(plane.cog));
        let wingSprites = [];
        plane.wings.forEach(wing => {
            let wingSprite = this.getWingSprite(wing);
            group.appendChild(wingSprite);
            wingSprites.push(wingSprite);
        });
        let engineSprites = [];
        plane.engines.forEach(engine => {
            let engineSprite = this.getEngineSprite(engine);
            group.appendChild(engineSprite);
            engineSprites.push(engineSprite);
        });
        let forceSprites = [];
        if (this.debug) {
            plane.getAllForceArms().forEach(forceArm => {
                let forceSprite = this.getForceSprite();
                this.container.appendChild(forceSprite);
                forceSprites.push(forceSprite);
            });
        }
        this.container.appendChild(group);
        this.planes.set(plane, { group: group, wingSprites, engineSprites, forceSprites });
    }
    getCogSprite(cog) {
        let cogSprite = this.createSvgElement('circle');
        cogSprite.setAttribute("cx", (cog.x * this.pixelsPerMeter).toString());
        cogSprite.setAttribute("cy", (-1 * cog.y * this.pixelsPerMeter).toString());
        cogSprite.setAttribute("r", (0.5 * this.pixelsPerMeter).toString());
        cogSprite.setAttribute('stroke', 'green');
        cogSprite.setAttribute('fill', 'green');
        return cogSprite;
    }
    getForceSprite() {
        let forceSprite = this.createSvgElement('line');
        forceSprite.setAttribute("stroke", "#000");
        forceSprite.setAttribute("stroke-width", "2");
        forceSprite.setAttribute("marker-end", "url(#arrowhead)");
        return forceSprite;
    }
    getWingSprite(wing) {
        let wingSprite = this.createSvgElement('line');
        let x1 = (wing.pos.x - wing.width / 2) * this.pixelsPerMeter;
        let y1 = -1 * wing.pos.y * this.pixelsPerMeter;
        let x2 = (wing.pos.x + wing.width / 2) * this.pixelsPerMeter;
        let y2 = (-1 * wing.pos.y * this.pixelsPerMeter);
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
    getEngineSprite(engine) {
        let radius = 0.5;
        let engineSprite = this.createSvgElement('circle');
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
                let y2 = (-1 * wing.pos.y * this.pixelsPerMeter);
                let cx = (x2 + x1) / 2;
                let cy = (y2 + y1) / 2;
                this.setAng(wingSprite, wing.ang, cx, cy);
            });
            if (this.debug) {
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
            let rotate = " rotate(" + this.decimalize(plane.ang * -180 / Math.PI) + " " + this.decimalize(plane.cog.x * this.pixelsPerMeter) + " " + this.decimalize(-1 * plane.cog.y * this.pixelsPerMeter) + ")";
            sprite.group.setAttribute("transform", translate + rotate);
        });
    }
    decimalize(number) {
        if (-0.00001 < number && number < 0.00001) {
            number = 0;
        }
        return number.toFixed(5);
    }
    setAng(element, ang, cx, cy) {
        let rotate = " rotate(" + this.decimalize(ang * -180 / Math.PI) + " " + this.decimalize(cx) + " " + this.decimalize(cy) + ")";
        element.setAttribute("transform", rotate);
    }
    setDimensions() {
        let style = window.getComputedStyle(this.container, null);
        var horizontalPadding = parseFloat(style.paddingLeft) +
            parseFloat(style.paddingRight);
        var verticalPadding = parseFloat(style.paddingTop) +
            parseFloat(style.paddingBottom);
        this.pixelWidth = this.container.clientWidth - horizontalPadding;
        this.pixelHeight = this.container.clientHeight - verticalPadding;
    }
    getPaintPos(realMeterPos) {
        let stageMeterPos = realMeterPos.minus(this.origin);
        let stagePixelPos = stageMeterPos.times(this.pixelsPerMeter);
        let PaintPos = Vec_1.default.n(stagePixelPos.x, this.pixelHeight - stagePixelPos.y);
        return PaintPos;
    }
}
exports.default = Stage;


/***/ }),

/***/ "./src/Vec.ts":
/*!********************!*\
  !*** ./src/Vec.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Vec {
    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    set x(val) {
        this._x = val;
    }
    get y() {
        return this._y;
    }
    set y(val) {
        this._y = val;
    }
    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set magnitude(magnitude) {
        if (this.magnitude === 0) {
            this._x = magnitude;
            this._y = 0;
        }
        else {
            let multiplier = magnitude / this.magnitude;
            this._x *= multiplier;
            this._y *= multiplier;
        }
    }
    get angle() {
        return Math.atan2(this.y, this.x);
    }
    set angle(a) {
        let magnitude = this.magnitude;
        this._x = magnitude * Math.cos(a);
        this._y = magnitude * Math.sin(a);
    }
    times(factor) {
        let response = this.clone();
        response.magnitude *= factor;
        return response;
    }
    mirrorX() {
        let response = this.clone();
        response.x = -1 * response.x;
        return response;
    }
    mirrorY() {
        let response = this.clone();
        response.y = -1 * response.y;
        return response;
    }
    divide(dividend) {
        let response = this.clone();
        response.magnitude /= dividend;
        return response;
    }
    plus(...vectors) {
        let response = this.clone();
        vectors.forEach(vector => {
            response._x += vector.x;
            response._y += vector.y;
        });
        return response;
    }
    minus(...vectors) {
        let response = this.clone();
        vectors.forEach(vector => {
            response._x -= vector.x;
            response._y -= vector.y;
        });
        return response;
    }
    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
    cross(vec) {
        return this.x * vec.y - this.y * vec.x;
    }
    rotate(angle) {
        let response = this.clone();
        response.angle += angle;
        return response;
    }
    clone() {
        return new Vec(this.x, this.y);
    }
    static sum(...vectors) {
        return new Vec().plus(...vectors);
    }
    static n(x = 0, y = 0) {
        return new Vec(x, y);
    }
}
exports.default = Vec;


/***/ }),

/***/ "./src/Wing.ts":
/*!*********************!*\
  !*** ./src/Wing.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vec_1 = __importDefault(__webpack_require__(/*! ./Vec */ "./src/Vec.ts"));
class Wing {
    constructor(pos, angMid, angDiff, length, width, getControlVal) {
        this.pos = pos;
        this.angMid = angMid;
        this.angDiff = angDiff;
        this.length = length;
        this.width = width;
        this.getControlVal = getControlVal;
    }
    getForce(absWingAngle, airVel, airDensity) {
        let AoA = absWingAngle - airVel.angle;
        let forceMagnitude = this.getForceMagnitude(airVel.magnitude, AoA, airDensity);
        let forceAngle = absWingAngle + Math.PI / 2;
        return Vec_1.default.n(forceMagnitude).rotate(forceAngle);
    }
    getForceMagnitude(airSpeed, AoA, airDensity) {
        let sinTheta = Math.sin(AoA);
        return 2 * airSpeed * airSpeed * Math.abs(sinTheta) * sinTheta * this.length * this.width * airDensity;
    }
    get ang() {
        return this.angMid + (this.angDiff * this.getControlVal());
    }
}
exports.default = Wing;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Stage_1 = __importDefault(__webpack_require__(/*! ./Stage */ "./src/Stage.ts"));
const Setting_1 = __importDefault(__webpack_require__(/*! ./Setting */ "./src/Setting.ts"));
const Plane_1 = __importDefault(__webpack_require__(/*! ./Plane */ "./src/Plane.ts"));
const Vec_1 = __importDefault(__webpack_require__(/*! ./Vec */ "./src/Vec.ts"));
const Wing_1 = __importDefault(__webpack_require__(/*! ./Wing */ "./src/Wing.ts"));
const Engine_1 = __importDefault(__webpack_require__(/*! ./Engine */ "./src/Engine.ts"));
let stage = new Stage_1.default(document.getElementById('stage'), true);
let setting = new Setting_1.default();
document.addEventListener('keydown', (e) => { setting.keyDown(e.key); });
document.addEventListener('keyup', (e) => { setting.keyUp(e.key); });
let engine = new Engine_1.default(Vec_1.default.n(9, 2), 0, 100, () => setting.isKeyDown(" ") ? 0.8 : 0);
let wing = new Wing_1.default(Vec_1.default.n(6, 3), 0.07, 0, 10, 4, () => 0);
let tail = new Wing_1.default(Vec_1.default.n(1, 2), -0.01, Math.PI / 6, 3, 2, () => {
    if (setting.isKeyDown("s")) {
        return 0.8;
    }
    else if (setting.isKeyDown("a")) {
        return -0.8;
    }
    else {
        return 0;
    }
});
let plane = new Plane_1.default(Vec_1.default.n(10, 50), Vec_1.default.n(30, 0), 0, 0, Vec_1.default.n(7, 2), setting);
plane.addWing(wing);
plane.addWing(tail);
plane.addEngine(engine);
stage.addPlane(plane);
let ts = 1 / 60;
let speedRatio = 1;
setInterval(() => {
    setting.setGamepad(navigator.getGamepads()[0]);
    plane.updatePosition(ts * speedRatio);
    stage.render();
}, ts * 1000);
stage.render();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELDhCQUE4QixtQkFBTyxDQUFDLDJCQUFPO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7Ozs7Ozs7Ozs7QUMxRUY7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDYkY7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCw4QkFBOEIsbUJBQU8sQ0FBQywyQkFBTztBQUM3Qyx5Q0FBeUMsbUJBQU8sQ0FBQyxpREFBa0I7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDdERGO0FBQ2I7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsOEJBQThCLG1CQUFPLENBQUMsMkJBQU87QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOzs7Ozs7Ozs7OztBQzdERjtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELDhCQUE4QixtQkFBTyxDQUFDLDJCQUFPO0FBQzdDO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQyw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixXQUFXO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixZQUFZO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsaUNBQWlDLHdEQUF3RDtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDNU1GO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOzs7Ozs7Ozs7OztBQ2xHRjtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELDhCQUE4QixtQkFBTyxDQUFDLDJCQUFPO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOzs7Ozs7Ozs7OztBQzdCRjtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGdDQUFnQyxtQkFBTyxDQUFDLCtCQUFTO0FBQ2pELGtDQUFrQyxtQkFBTyxDQUFDLG1DQUFXO0FBQ3JELGdDQUFnQyxtQkFBTyxDQUFDLCtCQUFTO0FBQ2pELDhCQUE4QixtQkFBTyxDQUFDLDJCQUFPO0FBQzdDLCtCQUErQixtQkFBTyxDQUFDLDZCQUFRO0FBQy9DLGlDQUFpQyxtQkFBTyxDQUFDLGlDQUFVO0FBQ25EO0FBQ0E7QUFDQSw4Q0FBOEMseUJBQXlCO0FBQ3ZFLDRDQUE0Qyx1QkFBdUI7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7Ozs7Ozs7VUMzQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3NvYXIvLi9zcmMvQWJzdHJhY3RPYmplY3QudHMiLCJ3ZWJwYWNrOi8vc29hci8uL3NyYy9FbmdpbmUudHMiLCJ3ZWJwYWNrOi8vc29hci8uL3NyYy9QbGFuZS50cyIsIndlYnBhY2s6Ly9zb2FyLy4vc3JjL1NldHRpbmcudHMiLCJ3ZWJwYWNrOi8vc29hci8uL3NyYy9TdGFnZS50cyIsIndlYnBhY2s6Ly9zb2FyLy4vc3JjL1ZlYy50cyIsIndlYnBhY2s6Ly9zb2FyLy4vc3JjL1dpbmcudHMiLCJ3ZWJwYWNrOi8vc29hci8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9zb2FyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NvYXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9zb2FyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zb2FyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFZlY18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL1ZlY1wiKSk7XG5jbGFzcyBBYnN0cmFjdE9iamVjdCB7XG4gICAgY29uc3RydWN0b3IocG9zLCB2ZWwsIGFuZywgYW5nVmVsLCBjb2csIHNldHRpbmcpIHtcbiAgICAgICAgdGhpcy5tYXNzID0gMTA7XG4gICAgICAgIHRoaXMubW9tZW50ID0gMzAwO1xuICAgICAgICB0aGlzLm1vZCA9IGZ1bmN0aW9uIChudW1iZXIsIGJhc2UpIHtcbiAgICAgICAgICAgIHJldHVybiAoKG51bWJlciAlIGJhc2UpICsgYmFzZSkgJSBiYXNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnBvcyA9IHBvcztcbiAgICAgICAgdGhpcy52ZWwgPSB2ZWw7XG4gICAgICAgIHRoaXMuYW5nID0gYW5nO1xuICAgICAgICB0aGlzLmFuZ1ZlbCA9IGFuZ1ZlbDtcbiAgICAgICAgdGhpcy5jb2cgPSBjb2c7XG4gICAgICAgIHRoaXMuc2V0dGluZyA9IHNldHRpbmc7XG4gICAgfVxuICAgIGdldEFpclZlbChwb3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWJzVmVsKHBvcylcbiAgICAgICAgICAgIC5taW51cyh0aGlzLnNldHRpbmcuZ2V0V2luZCh0aGlzLmdldEFic1Bvcyhwb3MpKSk7XG4gICAgfVxuICAgIHVwZGF0ZVBvc2l0aW9uKGR0KSB7XG4gICAgICAgIGxldCBmb3JjZUFybXMgPSB0aGlzLmdldEFsbEZvcmNlQXJtcygpO1xuICAgICAgICBsZXQgYWNjID0gdGhpcy5nZXROZXRGb3JjZShmb3JjZUFybXMpLmRpdmlkZSh0aGlzLm1hc3MpO1xuICAgICAgICB0aGlzLnZlbCA9IHRoaXMudmVsLnBsdXMoYWNjLnRpbWVzKGR0KSk7XG4gICAgICAgIHRoaXMucG9zID0gdGhpcy5wb3MucGx1cyh0aGlzLnZlbC50aW1lcyhkdCkpO1xuICAgICAgICBsZXQgYW5nQWNjID0gdGhpcy5nZXROZXRUb3JxdWUoZm9yY2VBcm1zKSAvIHRoaXMubW9tZW50O1xuICAgICAgICB0aGlzLmFuZ1ZlbCArPSBhbmdBY2MgKiBkdDtcbiAgICAgICAgdGhpcy5hbmcgPSB0aGlzLm1vZCh0aGlzLmFuZyArIHRoaXMuYW5nVmVsICogZHQsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgaWYgKGlzTmFOKHRoaXMuYW5nVmVsKSB8fCBpc05hTih0aGlzLmFuZykpIHtcbiAgICAgICAgICAgIHJldHVybiAnTm90IGEgTnVtYmVyISc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0QXJtKHBvcykge1xuICAgICAgICByZXR1cm4gcG9zLm1pbnVzKHRoaXMuY29nKVxuICAgICAgICAgICAgLnJvdGF0ZSh0aGlzLmFuZyk7XG4gICAgfVxuICAgIGdldEFic1Bvcyhwb3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXJtKHBvcylcbiAgICAgICAgICAgIC5wbHVzKHRoaXMucG9zKTtcbiAgICB9XG4gICAgZ2V0QWJzVmVsKHBvcykge1xuICAgICAgICBsZXQgbm9yQXJtID0gdGhpcy5nZXRBcm0ocG9zKTtcbiAgICAgICAgbGV0IHZlbE1hZyA9IG5vckFybS5tYWduaXR1ZGUgKiB0aGlzLmFuZ1ZlbDtcbiAgICAgICAgbGV0IHZlbEFuZyA9IG5vckFybS5hbmdsZSArIE1hdGguUEkgLyAyO1xuICAgICAgICBsZXQgcmVsVmVsID0gVmVjXzEuZGVmYXVsdC5uKHZlbE1hZykucm90YXRlKHZlbEFuZyk7XG4gICAgICAgIGxldCBhYnNWZWwgPSByZWxWZWwucGx1cyh0aGlzLnZlbCk7XG4gICAgICAgIHJldHVybiBhYnNWZWw7XG4gICAgfVxuICAgIGdldE5ldEZvcmNlKGFsbEZvcmNlQXJtcykge1xuICAgICAgICBsZXQgbmV0Rm9yY2UgPSBWZWNfMS5kZWZhdWx0Lm4oKTtcbiAgICAgICAgYWxsRm9yY2VBcm1zLmZvckVhY2goZm9yY2VBcm0gPT4ge1xuICAgICAgICAgICAgbmV0Rm9yY2UueCArPSBmb3JjZUFybS5mb3JjZS54O1xuICAgICAgICAgICAgbmV0Rm9yY2UueSArPSBmb3JjZUFybS5mb3JjZS55O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG5ldEZvcmNlO1xuICAgIH1cbiAgICBnZXROZXRUb3JxdWUoYWxsRm9yY2VBcm1zKSB7XG4gICAgICAgIGxldCBuZXRUb3JxdWUgPSAwO1xuICAgICAgICBhbGxGb3JjZUFybXMuZm9yRWFjaChmb3JjZUFybSA9PiB7XG4gICAgICAgICAgICBuZXRUb3JxdWUgKz0gdGhpcy5nZXRUb3JxdWUoZm9yY2VBcm0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG5ldFRvcnF1ZTtcbiAgICB9XG4gICAgZ2V0VG9ycXVlKGZvcmNlQXJtKSB7XG4gICAgICAgIGxldCB0aGV0YSA9IGZvcmNlQXJtLmZvcmNlLmFuZ2xlIC0gZm9yY2VBcm0uYXJtLmFuZ2xlO1xuICAgICAgICByZXR1cm4gZm9yY2VBcm0uZm9yY2UubWFnbml0dWRlICpcbiAgICAgICAgICAgIGZvcmNlQXJtLmFybS5tYWduaXR1ZGUgKlxuICAgICAgICAgICAgTWF0aC5zaW4odGhldGEpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEFic3RyYWN0T2JqZWN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKHBvcywgYW5nLCBtYXhUaHJ1c3QsIGdldENvbnRyb2xWYWwpIHtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgICAgIHRoaXMuYW5nID0gYW5nO1xuICAgICAgICB0aGlzLm1heFRocnVzdCA9IG1heFRocnVzdDtcbiAgICAgICAgdGhpcy5nZXRDb250cm9sVmFsID0gZ2V0Q29udHJvbFZhbDtcbiAgICB9XG4gICAgZ2V0IHRocnVzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF4VGhydXN0ICogdGhpcy5nZXRDb250cm9sVmFsKCk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRW5naW5lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBWZWNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9WZWNcIikpO1xuY29uc3QgQWJzdHJhY3RPYmplY3RfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9BYnN0cmFjdE9iamVjdFwiKSk7XG5jbGFzcyBQbGFuZSBleHRlbmRzIEFic3RyYWN0T2JqZWN0XzEuZGVmYXVsdCB7XG4gICAgY29uc3RydWN0b3IocG9zLCB2ZWwsIGFuZywgYW5nVmVsLCBjb2csIHNldHRpbmcpIHtcbiAgICAgICAgc3VwZXIocG9zLCB2ZWwsIGFuZywgYW5nVmVsLCBjb2csIHNldHRpbmcpO1xuICAgICAgICB0aGlzLndpbmdzID0gW107XG4gICAgICAgIHRoaXMuZW5naW5lcyA9IFtdO1xuICAgIH1cbiAgICBhZGRXaW5nKHdpbmcpIHtcbiAgICAgICAgdGhpcy53aW5ncy5wdXNoKHdpbmcpO1xuICAgIH1cbiAgICBhZGRFbmdpbmUoZW5naW5lKSB7XG4gICAgICAgIHRoaXMuZW5naW5lcy5wdXNoKGVuZ2luZSk7XG4gICAgfVxuICAgIGdldEFic1dpbmdBbmdsZSh3aW5nKSB7XG4gICAgICAgIHJldHVybiB3aW5nLmFuZyArIHRoaXMuYW5nO1xuICAgIH1cbiAgICBnZXRXaW5nRm9yY2VBcm0od2luZykge1xuICAgICAgICBsZXQgYWJzV2luZ0FuZ2xlID0gdGhpcy5nZXRBYnNXaW5nQW5nbGUod2luZyk7XG4gICAgICAgIGxldCBhaXJWZWwgPSB0aGlzLmdldEFpclZlbCh3aW5nLnBvcyk7XG4gICAgICAgIGxldCB3aW5nRm9yY2UgPSB3aW5nLmdldEZvcmNlKGFic1dpbmdBbmdsZSwgYWlyVmVsLCB0aGlzLnNldHRpbmcuYWlyRGVuc2l0eSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmb3JjZTogd2luZ0ZvcmNlLFxuICAgICAgICAgICAgYXJtOiB0aGlzLmdldEFybSh3aW5nLnBvcylcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZ2V0V2VpZ2h0Rm9yY2VBcm0oKSB7XG4gICAgICAgIGxldCBmb3JjZSA9IFZlY18xLmRlZmF1bHQubigwLCB0aGlzLm1hc3MgKiB0aGlzLnNldHRpbmcuZyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmb3JjZSxcbiAgICAgICAgICAgIGFybTogVmVjXzEuZGVmYXVsdC5uKDAsIDApXG4gICAgICAgIH07XG4gICAgfVxuICAgIGdldEVuZ2luZUZvcmNlQXJtKGVuZ2luZSkge1xuICAgICAgICBsZXQgZm9yY2UgPSBWZWNfMS5kZWZhdWx0Lm4oZW5naW5lLnRocnVzdCkucm90YXRlKGVuZ2luZS5hbmcpLnJvdGF0ZSh0aGlzLmFuZyk7XG4gICAgICAgIGxldCBhcm0gPSB0aGlzLmdldEFybShlbmdpbmUucG9zKTtcbiAgICAgICAgcmV0dXJuIHsgZm9yY2UsIGFybSB9O1xuICAgIH1cbiAgICBnZXRBbGxGb3JjZUFybXMoKSB7XG4gICAgICAgIGxldCBmb3JjZUFybXMgPSBbdGhpcy5nZXRXZWlnaHRGb3JjZUFybSgpXTtcbiAgICAgICAgdGhpcy5lbmdpbmVzLmZvckVhY2goZW5naW5lID0+IHtcbiAgICAgICAgICAgIGZvcmNlQXJtcy5wdXNoKHRoaXMuZ2V0RW5naW5lRm9yY2VBcm0oZW5naW5lKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLndpbmdzLmZvckVhY2god2luZyA9PiB7XG4gICAgICAgICAgICBmb3JjZUFybXMucHVzaCh0aGlzLmdldFdpbmdGb3JjZUFybSh3aW5nKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZm9yY2VBcm1zO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFBsYW5lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBWZWNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9WZWNcIikpO1xuY2xhc3MgU2V0dGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMua2V5c0Rvd24gPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuZyA9IC05Ljg7XG4gICAgICAgIHRoaXMuYWlyRGVuc2l0eSA9IDEuMjI1O1xuICAgIH1cbiAgICBzZXRHYW1lcGFkKGdhbWVwYWQpIHtcbiAgICAgICAgdGhpcy5nYW1lcGFkID0gZ2FtZXBhZDtcbiAgICB9XG4gICAgZ2V0UnVkZGVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuZ2FtZXBhZCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lcGFkLmF4ZXNbMF07XG4gICAgfVxuICAgIGdldFRocnVzdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmdhbWVwYWQpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgcmV0dXJuIC0xICogdGhpcy5nYW1lcGFkLmF4ZXNbMV07XG4gICAgfVxuICAgIGdldEFpbGVyb25zKCkge1xuICAgICAgICBpZiAoIXRoaXMuZ2FtZXBhZCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lcGFkLmF4ZXNbMl07XG4gICAgfVxuICAgIGdldEVsZXZhdG9yKCkge1xuICAgICAgICBpZiAoIXRoaXMuZ2FtZXBhZCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICByZXR1cm4gLTEgKiB0aGlzLmdhbWVwYWQuYXhlc1szXTtcbiAgICB9XG4gICAga2V5RG93bihrZXkpIHtcbiAgICAgICAgdGhpcy5rZXlzRG93bi5hZGQoa2V5KTtcbiAgICB9XG4gICAga2V5VXAoa2V5KSB7XG4gICAgICAgIHRoaXMua2V5c0Rvd24uZGVsZXRlKGtleSk7XG4gICAgfVxuICAgIGlzS2V5RG93bihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMua2V5c0Rvd24uaGFzKGtleSk7XG4gICAgfVxuICAgIGdldFdpbmQocG9zKSB7XG4gICAgICAgIGlmIChwb3MueSA8IDYwKSB7XG4gICAgICAgICAgICByZXR1cm4gVmVjXzEuZGVmYXVsdC5uKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gVmVjXzEuZGVmYXVsdC5uKC05LCAwKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFNldHRpbmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFZlY18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL1ZlY1wiKSk7XG5jbGFzcyBTdGFnZSB7XG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyLCBkZWJ1ZyA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMucGl4ZWxzUGVyTWV0ZXIgPSA0O1xuICAgICAgICB0aGlzLm1ldGVyc1Blck5ld3RvbiA9IDAuMjsgLy8gdG8gZHJhdyBmb3JjZSB2ZWN0b3JzXG4gICAgICAgIHRoaXMub3JpZ2luID0gVmVjXzEuZGVmYXVsdC5uKDAsIDApOyAvLyB3aGVyZSBib3R0b20gbGVmdCBvZiBzdGFnZSBzaG93cyBpbiByZWFsIG1ldGVyIGNvb3Jkc1xuICAgICAgICB0aGlzLnBsYW5lcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5kZWJ1ZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5kZWJ1ZyA9IGRlYnVnO1xuICAgICAgICB0aGlzLnNldERpbWVuc2lvbnMoKTtcbiAgICAgICAgd2luZG93Lm9ucmVzaXplID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREaW1lbnNpb25zKCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWRkU2t5KCk7XG4gICAgfVxuICAgIGNyZWF0ZVN2Z0VsZW1lbnQodHlwZSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgdHlwZSArIFwiXCIpO1xuICAgIH1cbiAgICBhZGRTa3koKSB7XG4gICAgICAgIGxldCBoZWlnaHQgPSA2MDtcbiAgICAgICAgbGV0IHN0YXJ0ID0gVmVjXzEuZGVmYXVsdC5uKDAsIGhlaWdodCk7XG4gICAgICAgIGxldCBwYWludFN0YXJ0ID0gdGhpcy5nZXRQYWludFBvcyhzdGFydCk7XG4gICAgICAgIGxldCBsaW5lID0gdGhpcy5jcmVhdGVTdmdFbGVtZW50KCdsaW5lJyk7XG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDFcIiwgcGFpbnRTdGFydC54LnRvU3RyaW5nKCkpO1xuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInkxXCIsIHBhaW50U3RhcnQueS50b1N0cmluZygpKTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MlwiLCB0aGlzLnBpeGVsV2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTJcIiwgcGFpbnRTdGFydC55LnRvU3RyaW5nKCkpO1xuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgJ2dyZXknKTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsICcxJyk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGxpbmUpO1xuICAgIH1cbiAgICBhZGRSZWN0KHBsYW5lLCBncm91cCkge1xuICAgICAgICBsZXQgd2lkdGggPSAxMDtcbiAgICAgICAgbGV0IGhlaWdodCA9IDQ7XG4gICAgICAgIGxldCByZWN0ID0gdGhpcy5jcmVhdGVTdmdFbGVtZW50KCdyZWN0Jyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCd4JywgJzAnKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3knLCAoLTEgKiBoZWlnaHQgKiB0aGlzLnBpeGVsc1Blck1ldGVyKS50b1N0cmluZygpKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgKHdpZHRoICogdGhpcy5waXhlbHNQZXJNZXRlcikudG9TdHJpbmcoKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAoaGVpZ2h0ICogdGhpcy5waXhlbHNQZXJNZXRlcikudG9TdHJpbmcoKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdzdHJva2UnLCAnZ3JleScpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgJzInKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKTtcbiAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQocmVjdCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgd2lkdGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGxpbmUgPSB0aGlzLmNyZWF0ZVN2Z0VsZW1lbnQoJ2xpbmUnKTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDFcIiwgKGkgKiB0aGlzLnBpeGVsc1Blck1ldGVyKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTFcIiwgJzAnKTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDJcIiwgKGkgKiB0aGlzLnBpeGVsc1Blck1ldGVyKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTJcIiwgKC0xICogaGVpZ2h0ICogdGhpcy5waXhlbHNQZXJNZXRlcikudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgJ2dyZXknKTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCAnMScpO1xuICAgICAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQobGluZSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBoZWlnaHQ7IGkrKykge1xuICAgICAgICAgICAgbGV0IGxpbmUgPSB0aGlzLmNyZWF0ZVN2Z0VsZW1lbnQoJ2xpbmUnKTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDFcIiwgJzAnKTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTFcIiwgKC0xICogaSAqIHRoaXMucGl4ZWxzUGVyTWV0ZXIpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MlwiLCAod2lkdGggKiB0aGlzLnBpeGVsc1Blck1ldGVyKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTJcIiwgKC0xICogaSAqIHRoaXMucGl4ZWxzUGVyTWV0ZXIpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsICdncmV5Jyk7XG4gICAgICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgJzEnKTtcbiAgICAgICAgICAgIGdyb3VwLmFwcGVuZENoaWxkKGxpbmUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZFBsYW5lKHBsYW5lKSB7XG4gICAgICAgIGxldCBncm91cCA9IHRoaXMuY3JlYXRlU3ZnRWxlbWVudCgnZycpO1xuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgdGhpcy5hZGRSZWN0KHBsYW5lLCBncm91cCk7XG4gICAgICAgIH1cbiAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5nZXRDb2dTcHJpdGUocGxhbmUuY29nKSk7XG4gICAgICAgIGxldCB3aW5nU3ByaXRlcyA9IFtdO1xuICAgICAgICBwbGFuZS53aW5ncy5mb3JFYWNoKHdpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IHdpbmdTcHJpdGUgPSB0aGlzLmdldFdpbmdTcHJpdGUod2luZyk7XG4gICAgICAgICAgICBncm91cC5hcHBlbmRDaGlsZCh3aW5nU3ByaXRlKTtcbiAgICAgICAgICAgIHdpbmdTcHJpdGVzLnB1c2god2luZ1Nwcml0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZW5naW5lU3ByaXRlcyA9IFtdO1xuICAgICAgICBwbGFuZS5lbmdpbmVzLmZvckVhY2goZW5naW5lID0+IHtcbiAgICAgICAgICAgIGxldCBlbmdpbmVTcHJpdGUgPSB0aGlzLmdldEVuZ2luZVNwcml0ZShlbmdpbmUpO1xuICAgICAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoZW5naW5lU3ByaXRlKTtcbiAgICAgICAgICAgIGVuZ2luZVNwcml0ZXMucHVzaChlbmdpbmVTcHJpdGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGZvcmNlU3ByaXRlcyA9IFtdO1xuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgcGxhbmUuZ2V0QWxsRm9yY2VBcm1zKCkuZm9yRWFjaChmb3JjZUFybSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGZvcmNlU3ByaXRlID0gdGhpcy5nZXRGb3JjZVNwcml0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGZvcmNlU3ByaXRlKTtcbiAgICAgICAgICAgICAgICBmb3JjZVNwcml0ZXMucHVzaChmb3JjZVNwcml0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChncm91cCk7XG4gICAgICAgIHRoaXMucGxhbmVzLnNldChwbGFuZSwgeyBncm91cDogZ3JvdXAsIHdpbmdTcHJpdGVzLCBlbmdpbmVTcHJpdGVzLCBmb3JjZVNwcml0ZXMgfSk7XG4gICAgfVxuICAgIGdldENvZ1Nwcml0ZShjb2cpIHtcbiAgICAgICAgbGV0IGNvZ1Nwcml0ZSA9IHRoaXMuY3JlYXRlU3ZnRWxlbWVudCgnY2lyY2xlJyk7XG4gICAgICAgIGNvZ1Nwcml0ZS5zZXRBdHRyaWJ1dGUoXCJjeFwiLCAoY29nLnggKiB0aGlzLnBpeGVsc1Blck1ldGVyKS50b1N0cmluZygpKTtcbiAgICAgICAgY29nU3ByaXRlLnNldEF0dHJpYnV0ZShcImN5XCIsICgtMSAqIGNvZy55ICogdGhpcy5waXhlbHNQZXJNZXRlcikudG9TdHJpbmcoKSk7XG4gICAgICAgIGNvZ1Nwcml0ZS5zZXRBdHRyaWJ1dGUoXCJyXCIsICgwLjUgKiB0aGlzLnBpeGVsc1Blck1ldGVyKS50b1N0cmluZygpKTtcbiAgICAgICAgY29nU3ByaXRlLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgJ2dyZWVuJyk7XG4gICAgICAgIGNvZ1Nwcml0ZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnZ3JlZW4nKTtcbiAgICAgICAgcmV0dXJuIGNvZ1Nwcml0ZTtcbiAgICB9XG4gICAgZ2V0Rm9yY2VTcHJpdGUoKSB7XG4gICAgICAgIGxldCBmb3JjZVNwcml0ZSA9IHRoaXMuY3JlYXRlU3ZnRWxlbWVudCgnbGluZScpO1xuICAgICAgICBmb3JjZVNwcml0ZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCIjMDAwXCIpO1xuICAgICAgICBmb3JjZVNwcml0ZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgXCIyXCIpO1xuICAgICAgICBmb3JjZVNwcml0ZS5zZXRBdHRyaWJ1dGUoXCJtYXJrZXItZW5kXCIsIFwidXJsKCNhcnJvd2hlYWQpXCIpO1xuICAgICAgICByZXR1cm4gZm9yY2VTcHJpdGU7XG4gICAgfVxuICAgIGdldFdpbmdTcHJpdGUod2luZykge1xuICAgICAgICBsZXQgd2luZ1Nwcml0ZSA9IHRoaXMuY3JlYXRlU3ZnRWxlbWVudCgnbGluZScpO1xuICAgICAgICBsZXQgeDEgPSAod2luZy5wb3MueCAtIHdpbmcud2lkdGggLyAyKSAqIHRoaXMucGl4ZWxzUGVyTWV0ZXI7XG4gICAgICAgIGxldCB5MSA9IC0xICogd2luZy5wb3MueSAqIHRoaXMucGl4ZWxzUGVyTWV0ZXI7XG4gICAgICAgIGxldCB4MiA9ICh3aW5nLnBvcy54ICsgd2luZy53aWR0aCAvIDIpICogdGhpcy5waXhlbHNQZXJNZXRlcjtcbiAgICAgICAgbGV0IHkyID0gKC0xICogd2luZy5wb3MueSAqIHRoaXMucGl4ZWxzUGVyTWV0ZXIpO1xuICAgICAgICBsZXQgY3ggPSAoeDIgKyB4MSkgLyAyO1xuICAgICAgICBsZXQgY3kgPSAoeTIgKyB5MSkgLyAyO1xuICAgICAgICB3aW5nU3ByaXRlLnNldEF0dHJpYnV0ZShcIngxXCIsIHgxLnRvU3RyaW5nKCkpO1xuICAgICAgICB3aW5nU3ByaXRlLnNldEF0dHJpYnV0ZShcInkxXCIsIHkxLnRvU3RyaW5nKCkpO1xuICAgICAgICB3aW5nU3ByaXRlLnNldEF0dHJpYnV0ZShcIngyXCIsIHgyLnRvU3RyaW5nKCkpO1xuICAgICAgICB3aW5nU3ByaXRlLnNldEF0dHJpYnV0ZShcInkyXCIsIHkyLnRvU3RyaW5nKCkpO1xuICAgICAgICB3aW5nU3ByaXRlLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgJ3JlZCcpO1xuICAgICAgICB3aW5nU3ByaXRlLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgJzMnKTtcbiAgICAgICAgbGV0IHJvdGF0ZSA9IFwiIHJvdGF0ZShcIiArIHdpbmcuYW5nICogLTE4MCAvIE1hdGguUEkgKyBcIiBcIiArIGN4ICsgXCIgXCIgKyBjeSArIFwiKVwiO1xuICAgICAgICB3aW5nU3ByaXRlLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCByb3RhdGUpO1xuICAgICAgICByZXR1cm4gd2luZ1Nwcml0ZTtcbiAgICB9XG4gICAgZ2V0RW5naW5lU3ByaXRlKGVuZ2luZSkge1xuICAgICAgICBsZXQgcmFkaXVzID0gMC41O1xuICAgICAgICBsZXQgZW5naW5lU3ByaXRlID0gdGhpcy5jcmVhdGVTdmdFbGVtZW50KCdjaXJjbGUnKTtcbiAgICAgICAgZW5naW5lU3ByaXRlLnNldEF0dHJpYnV0ZShcImN4XCIsIChlbmdpbmUucG9zLnggKiB0aGlzLnBpeGVsc1Blck1ldGVyKS50b1N0cmluZygpKTtcbiAgICAgICAgZW5naW5lU3ByaXRlLnNldEF0dHJpYnV0ZShcImN5XCIsICgtMSAqIGVuZ2luZS5wb3MueSAqIHRoaXMucGl4ZWxzUGVyTWV0ZXIpLnRvU3RyaW5nKCkpO1xuICAgICAgICBlbmdpbmVTcHJpdGUuc2V0QXR0cmlidXRlKFwiclwiLCAocmFkaXVzICogdGhpcy5waXhlbHNQZXJNZXRlcikudG9TdHJpbmcoKSk7XG4gICAgICAgIGVuZ2luZVNwcml0ZS5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsICdibHVlJyk7XG4gICAgICAgIGVuZ2luZVNwcml0ZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnYmx1ZScpO1xuICAgICAgICByZXR1cm4gZW5naW5lU3ByaXRlO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMucGxhbmVzLmZvckVhY2goKHNwcml0ZSwgcGxhbmUpID0+IHtcbiAgICAgICAgICAgIHBsYW5lLndpbmdzLmZvckVhY2goKHdpbmcsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgd2luZ1Nwcml0ZSA9IHNwcml0ZS53aW5nU3ByaXRlc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgeDEgPSAod2luZy5wb3MueCAtIHdpbmcud2lkdGggLyAyKSAqIHRoaXMucGl4ZWxzUGVyTWV0ZXI7XG4gICAgICAgICAgICAgICAgbGV0IHkxID0gLTEgKiB3aW5nLnBvcy55ICogdGhpcy5waXhlbHNQZXJNZXRlcjtcbiAgICAgICAgICAgICAgICBsZXQgeDIgPSAod2luZy5wb3MueCArIHdpbmcud2lkdGggLyAyKSAqIHRoaXMucGl4ZWxzUGVyTWV0ZXI7XG4gICAgICAgICAgICAgICAgbGV0IHkyID0gKC0xICogd2luZy5wb3MueSAqIHRoaXMucGl4ZWxzUGVyTWV0ZXIpO1xuICAgICAgICAgICAgICAgIGxldCBjeCA9ICh4MiArIHgxKSAvIDI7XG4gICAgICAgICAgICAgICAgbGV0IGN5ID0gKHkyICsgeTEpIC8gMjtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFuZyh3aW5nU3ByaXRlLCB3aW5nLmFuZywgY3gsIGN5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVidWcpIHtcbiAgICAgICAgICAgICAgICBwbGFuZS5nZXRBbGxGb3JjZUFybXMoKS5mb3JFYWNoKChmb3JjZUFybSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZm9yY2VTcHJpdGUgPSBzcHJpdGUuZm9yY2VTcHJpdGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3RhcnQgPSBwbGFuZS5wb3MucGx1cyhwbGFuZS5jb2csIGZvcmNlQXJtLmFybSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlbmQgPSBzdGFydC5wbHVzKGZvcmNlQXJtLmZvcmNlLnRpbWVzKHRoaXMubWV0ZXJzUGVyTmV3dG9uKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdGFydFBhaW50UG9zID0gdGhpcy5nZXRQYWludFBvcyhzdGFydCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlbmRQYWludFBvcyA9IHRoaXMuZ2V0UGFpbnRQb3MoZW5kKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZpc2liaWxpdHkgPSBNYXRoLmFicyhmb3JjZUFybS5mb3JjZS5tYWduaXR1ZGUpID4gMC4xID9cbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJsZVwiIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgICAgIGZvcmNlU3ByaXRlLnNldEF0dHJpYnV0ZShcIngxXCIsIHN0YXJ0UGFpbnRQb3MueC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yY2VTcHJpdGUuc2V0QXR0cmlidXRlKFwieTFcIiwgKHN0YXJ0UGFpbnRQb3MueSkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIGZvcmNlU3ByaXRlLnNldEF0dHJpYnV0ZShcIngyXCIsIGVuZFBhaW50UG9zLngudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIGZvcmNlU3ByaXRlLnNldEF0dHJpYnV0ZShcInkyXCIsIChlbmRQYWludFBvcy55KS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yY2VTcHJpdGUuc2V0QXR0cmlidXRlKFwidmlzaWJpbGl0eVwiLCB2aXNpYmlsaXR5KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBwYWludFBvcyA9IHRoaXMuZ2V0UGFpbnRQb3MocGxhbmUucG9zKTtcbiAgICAgICAgICAgIGxldCB0cmFuc2xhdGUgPSBcIiB0cmFuc2xhdGUoXCIgKyBwYWludFBvcy54ICsgXCIgXCIgKyBwYWludFBvcy55ICsgXCIpXCI7XG4gICAgICAgICAgICBsZXQgcm90YXRlID0gXCIgcm90YXRlKFwiICsgdGhpcy5kZWNpbWFsaXplKHBsYW5lLmFuZyAqIC0xODAgLyBNYXRoLlBJKSArIFwiIFwiICsgdGhpcy5kZWNpbWFsaXplKHBsYW5lLmNvZy54ICogdGhpcy5waXhlbHNQZXJNZXRlcikgKyBcIiBcIiArIHRoaXMuZGVjaW1hbGl6ZSgtMSAqIHBsYW5lLmNvZy55ICogdGhpcy5waXhlbHNQZXJNZXRlcikgKyBcIilcIjtcbiAgICAgICAgICAgIHNwcml0ZS5ncm91cC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgdHJhbnNsYXRlICsgcm90YXRlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRlY2ltYWxpemUobnVtYmVyKSB7XG4gICAgICAgIGlmICgtMC4wMDAwMSA8IG51bWJlciAmJiBudW1iZXIgPCAwLjAwMDAxKSB7XG4gICAgICAgICAgICBudW1iZXIgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudW1iZXIudG9GaXhlZCg1KTtcbiAgICB9XG4gICAgc2V0QW5nKGVsZW1lbnQsIGFuZywgY3gsIGN5KSB7XG4gICAgICAgIGxldCByb3RhdGUgPSBcIiByb3RhdGUoXCIgKyB0aGlzLmRlY2ltYWxpemUoYW5nICogLTE4MCAvIE1hdGguUEkpICsgXCIgXCIgKyB0aGlzLmRlY2ltYWxpemUoY3gpICsgXCIgXCIgKyB0aGlzLmRlY2ltYWxpemUoY3kpICsgXCIpXCI7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIHJvdGF0ZSk7XG4gICAgfVxuICAgIHNldERpbWVuc2lvbnMoKSB7XG4gICAgICAgIGxldCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyLCBudWxsKTtcbiAgICAgICAgdmFyIGhvcml6b250YWxQYWRkaW5nID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nTGVmdCkgK1xuICAgICAgICAgICAgcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nUmlnaHQpO1xuICAgICAgICB2YXIgdmVydGljYWxQYWRkaW5nID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKSArXG4gICAgICAgICAgICBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pO1xuICAgICAgICB0aGlzLnBpeGVsV2lkdGggPSB0aGlzLmNvbnRhaW5lci5jbGllbnRXaWR0aCAtIGhvcml6b250YWxQYWRkaW5nO1xuICAgICAgICB0aGlzLnBpeGVsSGVpZ2h0ID0gdGhpcy5jb250YWluZXIuY2xpZW50SGVpZ2h0IC0gdmVydGljYWxQYWRkaW5nO1xuICAgIH1cbiAgICBnZXRQYWludFBvcyhyZWFsTWV0ZXJQb3MpIHtcbiAgICAgICAgbGV0IHN0YWdlTWV0ZXJQb3MgPSByZWFsTWV0ZXJQb3MubWludXModGhpcy5vcmlnaW4pO1xuICAgICAgICBsZXQgc3RhZ2VQaXhlbFBvcyA9IHN0YWdlTWV0ZXJQb3MudGltZXModGhpcy5waXhlbHNQZXJNZXRlcik7XG4gICAgICAgIGxldCBQYWludFBvcyA9IFZlY18xLmRlZmF1bHQubihzdGFnZVBpeGVsUG9zLngsIHRoaXMucGl4ZWxIZWlnaHQgLSBzdGFnZVBpeGVsUG9zLnkpO1xuICAgICAgICByZXR1cm4gUGFpbnRQb3M7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gU3RhZ2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIFZlYyB7XG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwKSB7XG4gICAgICAgIHRoaXMuX3ggPSB4O1xuICAgICAgICB0aGlzLl95ID0geTtcbiAgICB9XG4gICAgZ2V0IHgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgIH1cbiAgICBzZXQgeCh2YWwpIHtcbiAgICAgICAgdGhpcy5feCA9IHZhbDtcbiAgICB9XG4gICAgZ2V0IHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgIH1cbiAgICBzZXQgeSh2YWwpIHtcbiAgICAgICAgdGhpcy5feSA9IHZhbDtcbiAgICB9XG4gICAgZ2V0IG1hZ25pdHVkZSgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xuICAgIH1cbiAgICBzZXQgbWFnbml0dWRlKG1hZ25pdHVkZSkge1xuICAgICAgICBpZiAodGhpcy5tYWduaXR1ZGUgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3ggPSBtYWduaXR1ZGU7XG4gICAgICAgICAgICB0aGlzLl95ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtdWx0aXBsaWVyID0gbWFnbml0dWRlIC8gdGhpcy5tYWduaXR1ZGU7XG4gICAgICAgICAgICB0aGlzLl94ICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICB0aGlzLl95ICo9IG11bHRpcGxpZXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IGFuZ2xlKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnksIHRoaXMueCk7XG4gICAgfVxuICAgIHNldCBhbmdsZShhKSB7XG4gICAgICAgIGxldCBtYWduaXR1ZGUgPSB0aGlzLm1hZ25pdHVkZTtcbiAgICAgICAgdGhpcy5feCA9IG1hZ25pdHVkZSAqIE1hdGguY29zKGEpO1xuICAgICAgICB0aGlzLl95ID0gbWFnbml0dWRlICogTWF0aC5zaW4oYSk7XG4gICAgfVxuICAgIHRpbWVzKGZhY3Rvcikge1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSB0aGlzLmNsb25lKCk7XG4gICAgICAgIHJlc3BvbnNlLm1hZ25pdHVkZSAqPSBmYWN0b3I7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG4gICAgbWlycm9yWCgpIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5jbG9uZSgpO1xuICAgICAgICByZXNwb25zZS54ID0gLTEgKiByZXNwb25zZS54O1xuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfVxuICAgIG1pcnJvclkoKSB7XG4gICAgICAgIGxldCByZXNwb25zZSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgcmVzcG9uc2UueSA9IC0xICogcmVzcG9uc2UueTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cbiAgICBkaXZpZGUoZGl2aWRlbmQpIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5jbG9uZSgpO1xuICAgICAgICByZXNwb25zZS5tYWduaXR1ZGUgLz0gZGl2aWRlbmQ7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG4gICAgcGx1cyguLi52ZWN0b3JzKSB7XG4gICAgICAgIGxldCByZXNwb25zZSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgdmVjdG9ycy5mb3JFYWNoKHZlY3RvciA9PiB7XG4gICAgICAgICAgICByZXNwb25zZS5feCArPSB2ZWN0b3IueDtcbiAgICAgICAgICAgIHJlc3BvbnNlLl95ICs9IHZlY3Rvci55O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cbiAgICBtaW51cyguLi52ZWN0b3JzKSB7XG4gICAgICAgIGxldCByZXNwb25zZSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgdmVjdG9ycy5mb3JFYWNoKHZlY3RvciA9PiB7XG4gICAgICAgICAgICByZXNwb25zZS5feCAtPSB2ZWN0b3IueDtcbiAgICAgICAgICAgIHJlc3BvbnNlLl95IC09IHZlY3Rvci55O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cbiAgICBkb3QodmVjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2ZWMueCArIHRoaXMueSAqIHZlYy55O1xuICAgIH1cbiAgICBjcm9zcyh2ZWMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHZlYy55IC0gdGhpcy55ICogdmVjLng7XG4gICAgfVxuICAgIHJvdGF0ZShhbmdsZSkge1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSB0aGlzLmNsb25lKCk7XG4gICAgICAgIHJlc3BvbnNlLmFuZ2xlICs9IGFuZ2xlO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfVxuICAgIGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlYyh0aGlzLngsIHRoaXMueSk7XG4gICAgfVxuICAgIHN0YXRpYyBzdW0oLi4udmVjdG9ycykge1xuICAgICAgICByZXR1cm4gbmV3IFZlYygpLnBsdXMoLi4udmVjdG9ycyk7XG4gICAgfVxuICAgIHN0YXRpYyBuKHggPSAwLCB5ID0gMCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlYyh4LCB5KTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBWZWM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFZlY18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL1ZlY1wiKSk7XG5jbGFzcyBXaW5nIHtcbiAgICBjb25zdHJ1Y3Rvcihwb3MsIGFuZ01pZCwgYW5nRGlmZiwgbGVuZ3RoLCB3aWR0aCwgZ2V0Q29udHJvbFZhbCkge1xuICAgICAgICB0aGlzLnBvcyA9IHBvcztcbiAgICAgICAgdGhpcy5hbmdNaWQgPSBhbmdNaWQ7XG4gICAgICAgIHRoaXMuYW5nRGlmZiA9IGFuZ0RpZmY7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuZ2V0Q29udHJvbFZhbCA9IGdldENvbnRyb2xWYWw7XG4gICAgfVxuICAgIGdldEZvcmNlKGFic1dpbmdBbmdsZSwgYWlyVmVsLCBhaXJEZW5zaXR5KSB7XG4gICAgICAgIGxldCBBb0EgPSBhYnNXaW5nQW5nbGUgLSBhaXJWZWwuYW5nbGU7XG4gICAgICAgIGxldCBmb3JjZU1hZ25pdHVkZSA9IHRoaXMuZ2V0Rm9yY2VNYWduaXR1ZGUoYWlyVmVsLm1hZ25pdHVkZSwgQW9BLCBhaXJEZW5zaXR5KTtcbiAgICAgICAgbGV0IGZvcmNlQW5nbGUgPSBhYnNXaW5nQW5nbGUgKyBNYXRoLlBJIC8gMjtcbiAgICAgICAgcmV0dXJuIFZlY18xLmRlZmF1bHQubihmb3JjZU1hZ25pdHVkZSkucm90YXRlKGZvcmNlQW5nbGUpO1xuICAgIH1cbiAgICBnZXRGb3JjZU1hZ25pdHVkZShhaXJTcGVlZCwgQW9BLCBhaXJEZW5zaXR5KSB7XG4gICAgICAgIGxldCBzaW5UaGV0YSA9IE1hdGguc2luKEFvQSk7XG4gICAgICAgIHJldHVybiAyICogYWlyU3BlZWQgKiBhaXJTcGVlZCAqIE1hdGguYWJzKHNpblRoZXRhKSAqIHNpblRoZXRhICogdGhpcy5sZW5ndGggKiB0aGlzLndpZHRoICogYWlyRGVuc2l0eTtcbiAgICB9XG4gICAgZ2V0IGFuZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5nTWlkICsgKHRoaXMuYW5nRGlmZiAqIHRoaXMuZ2V0Q29udHJvbFZhbCgpKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBXaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBTdGFnZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL1N0YWdlXCIpKTtcbmNvbnN0IFNldHRpbmdfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9TZXR0aW5nXCIpKTtcbmNvbnN0IFBsYW5lXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vUGxhbmVcIikpO1xuY29uc3QgVmVjXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vVmVjXCIpKTtcbmNvbnN0IFdpbmdfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9XaW5nXCIpKTtcbmNvbnN0IEVuZ2luZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL0VuZ2luZVwiKSk7XG5sZXQgc3RhZ2UgPSBuZXcgU3RhZ2VfMS5kZWZhdWx0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFnZScpLCB0cnVlKTtcbmxldCBzZXR0aW5nID0gbmV3IFNldHRpbmdfMS5kZWZhdWx0KCk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHsgc2V0dGluZy5rZXlEb3duKGUua2V5KTsgfSk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7IHNldHRpbmcua2V5VXAoZS5rZXkpOyB9KTtcbmxldCBlbmdpbmUgPSBuZXcgRW5naW5lXzEuZGVmYXVsdChWZWNfMS5kZWZhdWx0Lm4oOSwgMiksIDAsIDEwMCwgKCkgPT4gc2V0dGluZy5pc0tleURvd24oXCIgXCIpID8gMC44IDogMCk7XG5sZXQgd2luZyA9IG5ldyBXaW5nXzEuZGVmYXVsdChWZWNfMS5kZWZhdWx0Lm4oNiwgMyksIDAuMDcsIDAsIDEwLCA0LCAoKSA9PiAwKTtcbmxldCB0YWlsID0gbmV3IFdpbmdfMS5kZWZhdWx0KFZlY18xLmRlZmF1bHQubigxLCAyKSwgLTAuMDEsIE1hdGguUEkgLyA2LCAzLCAyLCAoKSA9PiB7XG4gICAgaWYgKHNldHRpbmcuaXNLZXlEb3duKFwiTFwiKSkge1xuICAgICAgICByZXR1cm4gMC44O1xuICAgIH1cbiAgICBlbHNlIGlmIChzZXR0aW5nLmlzS2V5RG93bihcInFcIikpIHtcbiAgICAgICAgcmV0dXJuIDAuODtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2V0dGluZy5pc0tleURvd24oXCJhXCIpKSB7XG4gICAgICAgIHJldHVybiAtMC44O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufSk7XG5sZXQgcGxhbmUgPSBuZXcgUGxhbmVfMS5kZWZhdWx0KFZlY18xLmRlZmF1bHQubigxMCwgNTApLCBWZWNfMS5kZWZhdWx0Lm4oMzAsIDApLCAwLCAwLCBWZWNfMS5kZWZhdWx0Lm4oNywgMiksIHNldHRpbmcpO1xucGxhbmUuYWRkV2luZyh3aW5nKTtcbnBsYW5lLmFkZFdpbmcodGFpbCk7XG5wbGFuZS5hZGRFbmdpbmUoZW5naW5lKTtcbnN0YWdlLmFkZFBsYW5lKHBsYW5lKTtcbmxldCB0cyA9IDEgLyA2MDtcbmxldCBzcGVlZFJhdGlvID0gMTtcbnNldEludGVydmFsKCgpID0+IHtcbiAgICBzZXR0aW5nLnNldEdhbWVwYWQobmF2aWdhdG9yLmdldEdhbWVwYWRzKClbMF0pO1xuICAgIHBsYW5lLnVwZGF0ZVBvc2l0aW9uKHRzICogc3BlZWRSYXRpbyk7XG4gICAgc3RhZ2UucmVuZGVyKCk7XG59LCB0cyAqIDEwMDApO1xuc3RhZ2UucmVuZGVyKCk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=