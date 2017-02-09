class Force {

    constructor(name, color, getPosition, getValue) {
        this.name        = name || '';
        this.color       = color || '#CCC';
        this.getPosition = getPosition || function(){return Vector.create();}
        this.getValue    = getValue || function(){return Vector.create();}
        this.net_force   = Vector.create();
        this.character;
    }

    update(){
        // updatePosition();
        // updateValue();
        // updateTorque();
        // updateTranslationComponent();
        // updateAbsolutePosition();
        // updateCogOffset();
    }

    getCogOffset(){

        var cogOffset = Vector.difference(this.getPosition(), this.character.cog)
                              .addAngle(this.character.orientation);

        return cogOffset;
    }

    getTorque(){

        var value = this.getValue();

        var cog_offset = this.getCogOffset();

        var force_perp_mag = value.subtractAngle(cog_offset.getAngle()).getY();

        var lever_length = cog_offset.getMagnitude();

        return force_perp_mag * lever_length;
    }

    getTranslationComponent(){

        var value = this.getValue();

        var cog_offset = this.getCogOffset();

        var force_par_mag = value.subtractAngle(cog_offset.getAngle()).getX();

        return Vector.create().setPolar(cog_offset.getAngle(), force_par_mag);
    }

}