class Angle {

    constructor(radians) {
        this._radians = radians || 0;
    }

    set radians(a) {
        this._radians = a;
    }

    get radians() {
        return this._radians;
    }

    set degrees(degrees) {
        this._radians = degrees * Math.PI / 180;
    }

    get degrees() {
        var degrees = this._radians * 180 / Math.PI;
        var normalized_degrees = ((degrees%360)+360)%360;
        return normalized_degrees;
    }

    sin() {
        return Math.sin(this.radians);
    }

    cos() {
        return Math.cos(this.radians);
    }

    tan() {
        return Math.tan(this.radians);
    }

    add(a2) {
        console.log(a2.radians);
        this._radians += a2.radians;
        return this;
    }

    subtract(a2) {
        this._radians -= a2.radians;
        return this;
    }

}