class World {

    constructor(gravity, air_density) {
        this.gravity     = gravity == undefined ? 9.8 : gravity; // m/s^s
        this.air_density = air_density || 0.2;//1.225 // kg/ms^3
        this.characters  = [];
    }

    update(interval){
        this.characters.forEach(function(character){
            character.update(interval);
        });
    }

}