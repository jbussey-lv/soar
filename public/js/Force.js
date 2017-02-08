class Force {

    constructor(name, color, getPosition, getValue) {
        this.name        = name || '';
        this.color       = color || '#CCC';
        this.getPosition = getPosition || function(){return Vector.create();}
        this.getValue    = getValue || function(){return Vector.create();}
    }

    getName(){
        return this.name;
    }

    getColor(){
        return this.color;
    }

}