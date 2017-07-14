class Force {

    constructor(offset, value) {
        this.offset = offset || new Vector();
        this.value = value || new Vector();
    }

    translation() {
        var trans = new Vector();
        trans.setEqualTo(this.value);
        trans.angle.subtract(this.offset.angle);
        trans.magnitude = trans.x;
        trans.angle.setEqualTo(this.offset.angle);

        return trans;
    }

    torque() {
        var trans = new Vector();
        trans.setEqualTo(this.value);
        trans.angle.subtract(this.offset.angle);

        return trans.y * this.offset.magnitude;
    }





}