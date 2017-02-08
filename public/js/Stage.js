class Stage {

    constructor(id, world, pixel_width, pixel_height, pixels_per_meter, background_color) {
        this.id               = id;
        this.world            = world;
        this.pixel_width      = pixel_width || 600;
        this.pixel_height     = pixel_height || 400;
        this.pixels_per_meter = pixels_per_meter || 10;
        this.background_color = background_color || '#CCC';

        this.initializeContainer();
        this.initializeWorld();
    }

    initializeContainer(){
        this.dom_node = document.getElementById(this.id);
        this.dom_node.setAttribute('width', this.pixel_width);
        this.dom_node.setAttribute('height', this.pixel_height);
        this.dom_node.setAttribute('style', 'background-color: '+this.background_color);
    }

    initializeWorld(){
        var stage = this;
        stage.world.characters.forEach(function(character){
            character.dom_node = document.createElementNS('http://www.w3.org/2000/svg', 'image')
            character.dom_node.setAttributeNS('http://www.w3.org/1999/xlink','href', character.img);
            character.dom_node.setAttribute('preserveAspectRatio', 'none');
            stage.dom_node.appendChild(character.dom_node);

            character.forces.forEach(function(force){
                stage.initializeForce.call(stage, force);
            });
        });
    }

    initializeForce(force){
        force.dom_node = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        force.dom_node.setAttributeNS(null, 'stroke-width', 2);
        force.dom_node.setAttributeNS(null, 'stroke', force.color);
        this.dom_node.appendChild(force.dom_node);
    }


    addCharacter(character) {
        this.characters.push(character);
        character.world = this;
    }

    render(){
        var stage = this;
        stage.world.characters.forEach(function(character){
            stage.renderCharacter(character);
        });
    }

    renderCharacter(character) {
        var stage = this;
        stage.setSize(character);
        stage.setPosition(character);
        stage.setOrientation(character);
        character.forces.forEach(function(force){
            stage.renderForce(force);
        });
    }

    setSize(character){
        var pixel_width = this.metersToPixels(character.width);
        var pixel_height = this.metersToPixels(character.height);
        character.dom_node.setAttributeNS(null, 'width', pixel_width);
        character.dom_node.setAttributeNS(null, 'height', pixel_height);
    }

    setPosition(character){

        var position = character.position;
        var angle    = character.orientation;
        var cog      = character.cog;
        var screen_x = this.metersToPixels(position.getX() + cog.getX());
        var screen_y = this.metersToPixels(position.getY() + cog.getY());

        character.dom_node.setAttribute('x', screen_x);
        character.dom_node.setAttribute('y', screen_y);
        character.dom_node.setAttribute('transform', 'rotate('+angle+' '+screen_x+' '+screen_y+')');

    }

    setOrientation(character){

    }

    metersToPixels(meters){
        return meters * this.pixels_per_meter;
    }

    renderForce(force) {

        var x1 = 4;
        var y1 = 4;
        var x2 = 4;
        var y2 = 4;
    }

}