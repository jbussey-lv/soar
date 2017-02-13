class Force {

    constructor(updateRelativePosition, updateValue, name, color) {

        this.updateRelativePosition = updateRelativePosition;
        this.updateValue            = updateValue;
        this.name                   = name || '';
        this.color                  = color || '#CCC';

        this.relative_position      = Vector.create();
        this.relative_cog_offset    = Vector.create();
        this.absolute_cog_offset    = Vector.create();
        this.absolute_position      = Vector.create();
        this.value                  = Vector.create();
        this.translation_component  = Vector.create();
        this.torque                 = 0; // N/m
    }

    update(){
        this.updateRelativePosition();
        this.updateRelativeCogOffset();
        this.updateAbsoluteCogOffset();
        this.updateAbsolutePosition();
        this.updateValue();
        this.updateTranslationComponent();
        this.updateTorque();
    }

    updateRelativePosition(){
        this.relative_position.equate(getRelativePosition());
        return this;
    }

    updateRelativeCogOffset(){
        this.relative_cog_offset.equate(this.relative_position)
                                .subtract(this.character.cog);
        return this;
    }

    updateAbsoluteCogOffset(){
        this.absolute_cog_offset.equate(this.relative_cog_offset)
                                .addAngle(this.character.orientation);
        return this;
    }

    updateAbsolutePosition(){
        this.absolute_position.equate(this.character.position)
                              .add(this.absolute_cog_offset);
        return this;
    }

    updateTranslationComponent(){

        var angle = this.absolute_cog_offset.getAngle();

        var magnitude = this.relative_cog_offset.getX();

        this.translation_component.setPolar(angle, magnitude);
    }


    updateTorque(){

        var magnitude = this.relative_cog_offset.getY();

        var lever_length = this.relative_cog_offset.getMagnitude();

        return magnitude * lever_length;
    }

}