class Force {

    constructor(name, color, getPosition, getValue) {
        this.name        = name || '';
        this.color       = color || '#CCC';
        this.getPosition = getPosition || function(){return Vector.create();}
        this.getValue    = getValue || function(){return Vector.create();}
        this.net_force   = Vector.create();
        this.character;
    }

    getCogOffset(){

        var cogOffset = Vector.difference(this.getPosition(), 
                                          this.character.cog)
                              .addAngle(this.character.orientation);

        return cogOffset;
    }

    getRealTorque(){
        var value = this.getValue();

        var cog_offset = this.getCogOffset();

        var force_perp = value.subtractAngle(cog_offset.getAngle()).getY();

        var lever_length = cog_offset.getMagnitude();

        return force_perp * lever_length;
    }

    getRealForce(){

        var value = this.getValue();

        var cog_offset = this.getCogOffset();

        return value.subtractAngle(cog_offset.getAngle()).getX();
    }

}