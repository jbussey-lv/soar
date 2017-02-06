var Angle = (function(){

    var create = function(rad){

        var radians = rad;

        var getRadians = function(){
            return radians();
        }

        var setRadians = function(rad){
            radians = rad;
            return this;
        }

        var getDegrees = function(){
            return radians * 180 / Math.PI;
        }

        var setDegrees = function(degrees){
            radians = degrees * Math.PI / 180;
            return this;
        }

        var setXY = function(x, y){
            radians = Math.atan2(y, x);
            return this;
        }

        var add = function(angle2){
            radians += angle2.getRadians();
            return this;
        }

        var subtract = function(angle2){
            radians -= angle2.getRadians();
            return this;
        }

        var sin = function(){
            return Math.sin(radians);
        }

        var cos = function(){
            return Math.cos(radians);
        }

        return {
            getRadians,
            setRadians,
            getDegrees,
            setDegrees,
            setXY,
            add,
            subtract,
            sin,
            cos
        }
    }

    var sum = function(angles){
        
        var radians_total = 0;

        angles.forEach(function(a){
            radians_total += a.getRadians();
        });

        return Angle.create(radian_total);
    }

    var difference = function(a1, a2){

        var radians_diff = a1.getRadians() - a2.getRadians();

        return Angle.create(radians_diff);
    }

    return {create, sum, difference};
}());