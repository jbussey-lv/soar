class Force {

    constructor(initial_position, updateValue, color) {
        this.initial_position   = initial_position || new Vector();
        this.updateValue        = updateValue || (()=>{});
        this.color              = color || "#ccc";
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
        this.offset.setEqualTo(this.initial_position);
        this.offset.subtract(this.character.cog);
        this.offset.angle.add(this.character.orientation);
    }

    updatePosition() {
        this.position.setEqualTo(this.offset);
        this.position.add(this.character.position);
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