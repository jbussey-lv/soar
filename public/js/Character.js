var Character = (function(){

    var create = function(name,
                          img,
                          width,
                          height,
                          center_of_gravity,
                          position,
                          orientation,
                          forces,
                          velocity,
                          mass,
                          angular_velocity,
                          moment_of_intertia){

        var getName = function(){
            return name;
        }

        var getImg = function(){
            return img;
        }

        var getWidth = function(){
            return width;
        }

        var getHeight = function(){
            return height;
        }

        var getCenterOfGravity = function(){
            return center_of_gravity;
        }

        var getPosition = function(){
            return position;
        }

        var getOrientation = function(){
            return orientation;
        }

        var getForces = function(){
            return forces;
        }

        var update = function(interval){

        }

        return {
            getName,
            getImg,
            getWidth,
            getHeight,
            getCenterOfGravity,
            getPosition,
            getOrientation,
            getForces,
            update
        }
    }

    return {create};
}());