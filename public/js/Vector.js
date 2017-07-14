class Vector {

    constructor(xy_array) {
        this._angle = new Angle();
        this.magnitude = 0;
        this.xy = xy_array || [0, 0];
    }

    set angle(a2) {
        this._angle.equate(a2);
    }

    get angle() {
        return this._angle;
    }

    set xy(xy_array) {
        var x = xy_array[0];
        var y = xy_array[1];
        this.angle.radians = Math.atan2(y, x);
        this.magnitude = Math.sqrt(x * x + y * y);
    }

    get xy() {
        return [this.x, this.y];
    }

    set x(x) {
        this.xy = [x, this.y];
    }

    get x() {
        return this.angle.cos() * this.magnitude;
    }

    set y(y){
        this.xy = [this.x, y];
    }

    get y() {
        return this.angle.sin() * this.magnitude;
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

    reverse(){
        this.angle.radians += Math.PI;
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

    scale(s) {
        this.magnitude *= s;
        return this;
    }

    equate(v2) {
        this.angle = v2.angle;
        this.magnitude = v2.magnitude;
        return this;
    }

    dotProduct(v2) {
        return (this.x * v2.x) + (this.y * v2.y);
    }
}