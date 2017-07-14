class Angle {

    constructor(radians) {
        this._radians = typeof(radians) === 'number' ?
                        radians :
                        0;
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

    get sin() {
        return Math.sin(this.radians);
    }

    get cos() {
        return Math.cos(this.radians);
    }

    get tan() {
        return Math.tan(this.radians);
    }

    add(a2) {
        this.radians += v2.radians;
        return this;
    }

    subtract(a2) {
        this.radians -= v2.radians;
        return this;
    }

}