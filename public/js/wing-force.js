class WingForce extends Force{

    constructor(updateRelativePosition, getAngle, area, name, color) {

        super(updateRelativePosition, null, name, color);

        this.getAngle   = getAngle;
        this.area       = area;
        this.updateValue = this.updateValueSuper
    }

    updateValueSuper(){
        this.value.setPolar(
            this.getWingForceAngle(),
            this.getWingForceMagnitude()
        );
    }

    getWingForceMagnitude() {
        var m = -80 * this.character.velocity.getMagnitude();

        return m;

        // var v    = this.character.velocity.getMagnitude();
        // var AoA  = this.getAoA();
        // var x    = v * Math.sin(AoA);
        // var area = this.area;

        // return 2 * area * x * x;
    }

    getWingForceAngle(){
        return this.getAbsoluteAngle() + 90;
    }

    getAbsoluteAngle(){
        return this.getAngle() + 
               this.character.orientation;
    }

    getAoA() {
        return this.getAbsoluteAngle - 
               this.character.velocity.getAngle();
    }
}