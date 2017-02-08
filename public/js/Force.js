var Force = (function(Vector){

    var create = function(name, color, getPosition, getValue){

        var name        = name || '';
        var color       = color || '#CCC';
        var getPosition = getPosition || function(){return Vector.create();}
        var getValue    = getValue || function(){return Vector.create();}

        var getName = function(){
            return name;
        }

        var getColor = function(){
            return color;
        }

        var getCogOffset = function(){

            var cog_offset = Vector.difference(getPosition(), this.character.getCenterOfGravity())
                                   .addAngle(orientation);

            return cog_offset;
        }

        return {
            getName,
            getColor,
            getPosition,
            getValue,
            getCogOffset
        }
    }

    return {create};
}(Vector));