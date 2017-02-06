var vector = function(a, m){

    var angle = a;
    var magnitude = m;

    this.getX = function(){
        return Math.cos(angle) * magnitude;
    }

    this.getY = function(){
        return Math.sin(angle) * magnitude;
    }

    this.getAngle = function(){
        return angle;
    }

    this.getAngleDegrees = function()[
        return angle * 180/Math.PI;
    }

    this.getMagnitude = function(){
        return magnitude;
    }

    this.setAngle(a){
        this.angle = a;
    }

    this.setMagnitude(m){
        this.magnitude = m;
    }
}