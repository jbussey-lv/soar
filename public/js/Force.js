class Force {

    constructor(name, color, getPosition, getValue) {
        this.name        = name || '';
        this.color       = color || '#CCC';
        this.getPosition = getPosition || function(){return Vector.create();}
        this.getValue    = getValue || function(){return Vector.create();}
        this.character;
    }

    getCogOffset(){

        var cogOffset = Vector.difference(this.getPosition(), 
                                          this.character.cog)
                              .addAngle(this.character.orientation);

        return cogOffset;
    }

}