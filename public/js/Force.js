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
        this.updateTranslationComponentAndTorque();
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

    updateTranslationComponentAndTorque(){

        this.translation_component.equate(this.value)
                                  .subtractAngle(this.absolute_cog_offset.getAngle());

        var x = this.translation_component.getX();
        var y = this.translation_component.getY();

        this.translation_component.setPolar(this.absolute_cog_offset.getAngle(), x);

        this.torque = y * this.relative_cog_offset.getMagnitude();
    }

}