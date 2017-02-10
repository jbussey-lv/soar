class Force {

    constructor(getRelativePosition, updateValue, name, color) {

        this.updateValue            = updateValue;
        this.name                   = name || '';
        this.color                  = color || '#CCC';

        this.relative_position      = getRelativePosition();
        this.relative_cog_offset    = this.getRelativeCogOffset();
        this.absolute_cog_offset    = Vector.create();
        this.absolute_position      = Vector.create();
        this.value                  = Vector.create();
        this.translation_component  = Vector.create();
        this.torque                 = 0; // N/m
    }

    getRelativeCogOffset(){
        return Vector.difference(this.relative_position,
                               this.character.cog);
    }

    update(){
        updateAbsoluteCogOffset();
        updateAbsolutePosition();
        updateValue();
        updateTranslationComponent();
        updateTorque();
    }

    updateRelativeCogOffset(){
        this.relative_position = this.

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