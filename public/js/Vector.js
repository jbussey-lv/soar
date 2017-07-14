class Vector {

    constructor(xy_array) {
        this.angle = new Angle();
        this._magnitude = 0;
        this.xy = xy_array || [0, 0];
    }

    set xy(xy_array) {
        var x = xy_array[0];
        var y = xy_array[1];
        this.angle.radians = Math.atan2(y, x);
        this._magnitude = Math.sqrt(x * x + y * y);
    }

    get xy() {
        return [this.x, this.y];
    }

    set x(x) {
        this.xy = [x, this.y];
    }

    get x() {
        return this.angle.cos * this._magnitude;
    }

    set y(y){
        this.xy = [this.x, y];
    }

    get y() {
        return this.angle.sin * this._magnitude;
    }

    set magnitude(m) {
        this._magnitude = m;
    }

    get magnitude() {
        return this._magnitude;
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
        var new_x = this.x + v2.x;
        var new_y = this.y + v2.y;
        this.xy = [new_x, new_y];
        return this;
    }

    subtract(v2) {
        var new_x = this.x - v2.x;
        var new_y = this.y - v2.y;
        this.xy = [new_x, new_y];
        return this;
    }

    multiply(scale) {
        this._magnitude *= scale;
        return this;
    }

    reverse(){
        this.angle.radians += Math.PI;
        return this;
    }
}