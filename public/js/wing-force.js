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

        var v    = this.character.velocity.getMagnitude();
        var AoA  = this.getAoA();
        var area = this.area;

        var sin_aoa = Math.sin(AoA * Math.PI / 180)

        var mass_of_air = this.character.world.air_density * this.area * sin_aoa * v;
        var acceleration = 2 * v * sin_aoa;

        var force = mass_of_air * acceleration;

        return force;
    }

    getWingForceAngle(){
        return this.getAbsoluteAngle() - 90;
    }

    getAbsoluteAngle(){
        return this.getAngle() + 
               this.character.orientation;
    }

    getAoA() {
        var AoA = this.getAbsoluteAngle() - 
                    this.character.velocity.getAngle();
        return AoA;
    }
}
