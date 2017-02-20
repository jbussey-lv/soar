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
        this.updateAbsoluteCogOffset();
        this.updateAbsolutePosition();
        this.updateValue();
        this.updateTranslationComponentAndTorque();
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

    updateTranslationComponentAndTorque(){

        this.translation_component.equate(this.value);
        this.torque = 0;

        // if we're super close to the CoG... we're done.
        if(this.relative_cog_offset.getMagnitude() < 0.00000000000001){return;}

        var angle = this.translation_component.getAngle() - this.absolute_cog_offset.getAngle();
        var magnitude = this.translation_component.getMagnitude()

        this.translation_component.setMagnitude(Math.sin(angle * Math.PI / 180) * magnitude);
        this.torque = Math.cos(angle * Math.PI / 180) * magnitude;
    }


}