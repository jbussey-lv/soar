class Stage {

    constructor(id, world, pixel_width, pixel_height, background_color, pixels_per_meter, pixels_per_newton) {
        this.id               = id;
        this.world            = world;
        this.pixel_width      = pixel_width || 600;
        this.pixel_height     = pixel_height || 400;
        this.background_color = background_color || '#CCC';
        this.pixels_per_meter = pixels_per_meter || 3;
        this.pixels_per_newton = pixels_per_newton || 0.018;

        this.initializeContainer();
        this.initializeWorld();
        this.drawGuide();
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
            character.dom_node.setAttribute('width', stage.metersToPixels(character.width));
            character.dom_node.setAttribute('height', stage.metersToPixels(character.height));
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
        var stage       = this;
        var position    = character.position;
        var angle       = character.orientation;
        var cog         = character.cog;
        var x           = position.getX();
        var y           = position.getY();
        var adjusted_x  = x - cog.getX();
        var adjusted_y  = y - cog.getY();

        var screen_x = this.metersToPixels(x);
        var screen_y = this.metersToPixels(y);
        var screen_adjusted_x = this.metersToPixels(adjusted_x);
        var screen_adjusted_y = this.metersToPixels(adjusted_y);

        character.dom_node.setAttribute('x', screen_adjusted_x);
        character.dom_node.setAttribute('y', screen_adjusted_y);
        character.dom_node.setAttribute('transform', 'rotate('+angle+' '+screen_x+' '+screen_y+')');

        character.forces.forEach(function(force){
            stage.renderForce(force);
        });
    }

    renderForce(force) {

        var x1 = this.metersToPixels(force.absolute_position.getX());
        var y1 = this.metersToPixels(force.absolute_position.getY());
        var x2 = x1 + this.newtonsToPixels(force.value.getX());
        var y2 = y1 + this.newtonsToPixels(force.value.getY());

        force.dom_node.setAttribute('x1', x1);
        force.dom_node.setAttribute('y1', y1);
        force.dom_node.setAttribute('x2', x2);
        force.dom_node.setAttribute('y2', y2);
    }

    metersToPixels(meters){
        return meters * this.pixels_per_meter;
    }

    newtonsToPixels(newtons){
        return newtons * this.pixels_per_newton;
    }

    drawGuide(){

        var interval = 100;

        // verticals
        for(var i=interval; i<this.pixel_width; i+=interval){
            this.addLine(i, 0, i, this.pixel_height);
        }

        // horizontals
        for(var i=interval; i<this.pixel_height; i+=interval){
            this.addLine(0, i, this.pixel_width, i);
        }
    }

    addLine(x1, y1, x2, y2){
        var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        newLine.setAttribute('x1', x1);
        newLine.setAttribute('y1', y1);
        newLine.setAttribute('x2', x2);
        newLine.setAttribute('y2', y2);
        newLine.setAttributeNS(null, 'stroke-width', 1);
        newLine.setAttributeNS(null, 'stroke', 'red');
        this.dom_node.appendChild(newLine);
    }

}