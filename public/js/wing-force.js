class WingForce extends Force{

    constructor(updateRelativePosition, getAngle, area, name, color) {

        super(updateRelativePosition, null, name, color);

        this.getAngle   = getAngle;
        this.area       = area;
    }

    getWingValue() {
        var v    = this.character.velocity.getMagnitude();
        var AoA  = this.getAoA();
        var x    = v * Math.sin(AoA);
        var area = this.area;

        return 2 * area * x * x;
    }

    getAoA() {

        var AoA = this.getAngle() +
                  this.character.orientation - 
                  this.character.velocity.getAngle();

        return AoA;
    }

    getForceMagnitude() {



    }
}
