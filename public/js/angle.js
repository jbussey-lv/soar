class Angle {

    constructor(degrees) {
        this.degrees = degrees || 0;
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
        var degrees = this.radians * 180 / Math.PI;
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
        this.radians += a2.radians;
        return this;
    }

    scale(num) {
        this.radians *= num;
    }

    subtract(a2) {
        this.radians -= a2.radians;
        return this;
    }

    setEqualTo(a2) {
        this.radians = a2.radians;
    }

    isEqualTo(a2) {
        return this.radians === a2.radians;
    }

}