class Force {

    constructor(initial_position, updateValue) {
        this.initial_position   = initial_position;
        this.updateValue        = updateValue || (()=>{});
        this.position           = new Vector();
        this.offset             = new Vector();
        this.value              = new Vector();
        this.translation        = new Vector();
        this.torque             = 0;
    }

    update() {
        updateOffset();
        updatePosition();
        updateValue();
        updateTranslationAndTorque();
    }

    updateOffset() {

    }

    updatePosition() {
        

    }

    updateValue() {

    }

    updateTranslationAndTorque() {
        this.translation.setEqualTo(this.value);
        this.translation.angle.subtract(this.offset.angle);
        var x = this.translation.x;
        var y = this.translation.y;

        this.translation.magnitude = x;
        this.translation.angle.setEqualTo(this.offset.angle);

        this.torque = y * this.offset.magnitude;
    }

}