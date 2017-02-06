var Force = (function(){

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

        return {
            getName,
            getColor,
            getPosition,
            getValue
        }
    }

    return {create};
}());