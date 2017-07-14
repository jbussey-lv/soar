class Vector {

    constructor(xy_array) {
        this._angle = null;
        this._magnitude = null;
        this.xy = xy_array || [0, 0];
    }

    set xy(xy_array) {
        var x = xy_array[0];
        var y = xy_array[1];
        this._angle = Math.atan2(y, x);
        this._magnitude = Math.sqrt(x * x + y * y);
    }

    get xy() {
        return [this.x, this.y];
    }

    set x(x) {
        this.xy = [x, this.y];
    }

    get x() {
        return Math.cos(this._angle) * this._magnitude;
    }

    set y(y){
        this.xy = [this.x, y];
    }

    get y() {
        return Math.sin(this._angle) * this._magnitude;
    }

    set magnitude(m) {
        this._magnitude = m;
    }

    get magnitude() {
        return this._magnitude;
    }

    set angle(a) {
        this._angle = a;
    }

    get angle() {
        return this._angle;
    }

    set angle_degree(degrees) {
        this._angle = degrees * Math.PI / 180;
    }

    get angle_degrees() {
        var degrees = this._angle * 180 / Math.PI;
        var normalized_degrees = ((degrees%360)+360)%360;
        return normalized_degrees;
    }

    sumFromSet(set) {
        var x = 0;
        var y = 0;
        set.forEach(function(v){
            x += v.x;
            y += v.y;
        });
        this.xy = [x, y];
        return this;
    }

    add(v2) {
        this.x += v2.x;
        this.y += v2.y;
        return this;
    }

    subtract(v2) {
        this.x -= v2.x;
        this.y -= v2.y;
        return this;
    }

    multiply(scale) {
        this._magnitude *= scale;
        return this;
    }

    reverse(){
        this._angle += Math.PI;
        return this;
    }




}