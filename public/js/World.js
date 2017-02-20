class World {

    constructor(characters, gravity, air_density) {
        this.gravity     = gravity || 9.8; // m/s^s
        this.air_density = air_density || 0.2;//1.225 // kg/ms^3
        this.characters  = [];

        this.setCharacters(characters || []);
    }

    setCharacters(characters){
        var obj = this;
        characters.forEach(function(character){
            obj.addCharacter.call(obj, character);
        });
    }

    addCharacter(character) {
        this.characters.push(character);
        character.world = this;
    }

    update(interval){
        this.characters.forEach(function(character){
            character.update(interval);
        });
    }

}