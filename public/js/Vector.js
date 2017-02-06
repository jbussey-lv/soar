var Vector = (function(){

    var create = function(a, m){

        var angle = a;
        var magnitude = m;

        var getX = function(){
            return angle.cos() * magnitude;
        }

        var setX = function(x){
            setXY(x, getY());
            return this;
        }

        var getY = function(){
            return angle.sin() * magnitude;
        }

        var setY = function(y){
            setXY(getX(), y);
            return this;
        }

        var getXY = function(){
            return [getX(), getY()];
        }

        var setXY = function(x, y){
            angle.setXY(x, y);
            magnitude = Math.sqrt(x * x + y * y);
            return this;
        }

        var getAngle = function(){
            return angle;
        }

        var getMagnitude = function(){
            return magnitude;
        }

        var setAngle = function(a){
            angle = a;
            return this;
        }

        var setMagnitude = function(m){
            magnitude = m;
            return this;
        }

        var log = function(){
            console.log('angle: ' + getAngleDegrees() + ', magnitude: ' + getMagnitude());
        }

        return {
            getX,
            setX,
            getY,
            setY,
            getXY,
            setXY,
            getAngle,
            setAngle,
            getMagnitude,
            setMagnitude,
            log
        }
    }

    var sum = function(vectors){
          var total_x = 0;
          var total_y = 0;
          var total_vector = {};

          vectors.forEach(function(vector){
            total_x += vector.magnitude * Math.cos(vector.angle);
            total_y += vector.magnitude * Math.sin(vector.angle);
          });

          total_vector.magnitude = Math.sqrt(total_x*total_x + total_y*total_y);
          total_vector.angle = Math.atan2(total_y, total_x);

          return total_vector;
    }

    var difference = function(v1, v2){

        var v2_reversed = {
            angle: v2.angle,
            magnitude: (-1 * v2.magnitude)
        };

        return sumVectors([v1, v2_reversed]); 
    }

    return {create, sum, difference};
}());