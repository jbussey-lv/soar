class Force {

    constructor(character, initial_position, getValue, name) {
        this.character          = character;
        this.initial_position   = initial_position;
        this.getValue           = getValue;
        this.name               = name || "no-name";

        this.character.forces.push(this);
    }

    get offset() {
        var offset = new Vector();
        offset.setEqualTo(this.initial_position);
        offset.subtract(this.character.cog);
        offset.angle.add(this.character.orientation);
        return offset;
    }

    get position() {
        var position = new Vector()
        position.setEqualTo(this.offset);
        position.add(this.character.position);
        return position;
    }

    get value() {
        return this.getValue();
    }

    get translation() {
        
        var _translation = new Vector();
        _translation.setEqualTo(this.value);

        if(this.initial_position.isEqualTo(this.character.cog)){
            return _translation;
        }

        _translation.angle.subtract(this.offset.angle);

        _translation.magnitude = _translation.x;
        _translation.angle.setEqualTo(this.offset.angle);

        return _translation;
    }

    get torque() {
        var t = new Vector();
        t.setEqualTo(this.value);
        t.angle.subtract(this.offset.angle);

        return (t.y) * (this.offset.magnitude);
    }

}