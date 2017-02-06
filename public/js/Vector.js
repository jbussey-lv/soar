var Vector = (function(Angle){

    var create = function(a, m){

        var angle = a || Angle.create();
        var magnitude = m || 0;

        var getPolar = function(){
            return [angle, magnitude];
        }

        var setPolar = function(a,m){
            angle = a;
            magnitude = m;
            return this;
        }

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

        var add = function(v2){
            var combined = sum([this, v2]);
            setPolar(combined.getAngle(), combined.getMagnitude());
            return this;
        }

        var subtract = function(v2){
            var combined = difference(this, v2);
            setPolar(combined.getAngle(), combined.getMagnitude());
            return this;
        }

        var reverse = function(){
            magnitude *= -1;
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
            getPolar,
            setPolar,
            getXY,
            setXY,
            getAngle,
            setAngle,
            getMagnitude,
            setMagnitude,
            add,
            subtract,
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
}(Angle));