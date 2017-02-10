var Vector = (function(){

    var create = function(degrees, m){

        var angle = d2r(degrees);
        var magnitude = m || 0;

        var getPolar = function(){
            return [getAngle(), getMagnitude()];
        }

        var setPolar = function(degrees, m){
            setAngle(degrees);
            setMagnitude(m);
            return this;
        }

        var getX = function(){
            return Math.cos(angle) * magnitude;
        }

        var setX = function(x){
            setXY(x, getY());
            return this;
        }

        var getY = function(){
            return Math.sin(angle) * magnitude;
        }

        var setY = function(y){
            setXY(getX(), y);
            return this;
        }

        var getXY = function(){
            return [getX(), getY()];
        }

        var setXY = function(x, y){
            angle = Math.atan2(y,x);
            magnitude = Math.sqrt(x * x + y * y);
            return this;
        }

        var getAngle = function(){
            return r2d(angle);
        }

        var getMagnitude = function(){
            return magnitude;
        }

        var setAngle = function(degrees){
            angle = d2r(degrees);
            return this;
        }

        var setMagnitude = function(m){
            magnitude = m;
            return this;
        }

        var addAngle = function(degrees){
            angle += d2r(degrees);
            return this;
        }

        var subtractAngle = function(degrees){
            angle -= d2r(degrees);
            return this;
        }

        var add = function(v2, scale){
            var scale = scale || 1;
            setX(getX() + v2.getX() * scale);
            setY(getY() + v2.getY() * scale);
            return this;
        }

        var subtract = function(v2){
            setX(getX() - v2.getX());
            setY(getY() - v2.getY());
            return this;
        }

        var multiply = function(scale){
            magnitude *= scale;
            return this;
        }

        var reverse = function(){
            magnitude *= -1;
            return this;
        }

        var sin = function(){
            return Math.sin(angle);
        }

        var cos = function(){
            return Math.cos(angle);
        }

        var tan = function(){
            return Math.tan(angle);
        }

        var log = function(){
            console.log('angle: ' + getAngleDegrees() + ', magnitude: ' + getMagnitude());
        }

        var equate(v2){
            var angle2 = v2.getAngle();
            var magnitude = v2.getMagnitude();
            this.setPolar(angle2, magnitude2);
        }

        function r2d(radians){
            return radians * 180 / Math.PI;
        }

        function d2r(degrees){
            return degrees * Math.PI / 180;
        }

        return {
            getX,
            setX,
            getY,
            setY,
            getPolar,
            setPolar,
            getXY,
            setXY,
            getAngle,
            setAngle,
            addAngle,
            subtractAngle,
            getMagnitude,
            setMagnitude,
            add,
            subtract,
            multiply,
            log
        }
    }

    var sum = function(vectors){
        var total_x = 0;
        var total_y = 0;

        vectors.forEach(function(v){
            total_x += v.getX()
            total_y += v.getY();
        });

        return Vector.create().setXY(total_x, total_y);
    }

    var difference = function(v1, v2){

        var total_x = v1.getX() - v2.getX();
        var total_y = v1.getY() - v2.getY();

        return Vector.create().setXY(total_x, total_y);
    }

    return {create, sum, difference};
}());