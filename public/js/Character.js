class Character {

  constructor(name, img, width, height, cog, position, orientation, 
              forces, velocity, mass, angular_velocity, moment_of_inertia){

    this.name = name;
    this.img = img;
    this.width = width;
    this.height = height;
    this.cog = cog;
    this.position = position;
    this.velocity = velocity;
    this._orientation = orientation * Math.PI / 180;
    this.mass = mass || 1;
    this.angular_velocity = angular_velocity || 0;
    this.moment_of_intertia = moment_of_inertia || 1;
    this.forces = [];
    this.setForces(forces);
  }

  setForces(forces){
    var obj = this;
    forces.forEach(function(force){
      obj.forces.push(force);
      force.character = obj;
    });
  }

  getNetForce(){

  }

  getNetTorque(){
  }

  update(interval){
    // update all forces

    // get new torque
    // update anguler velocity (interval)
    // update orientation (interval)

    // get net force
    // update linear velocity (interval)
    // update position (interval)
  }

  get orientation(){
    return this._orientation * 180 / Math.PI;
  }

  set orientation(deg) {
    this._orientation = deg * Math.PI / 180;
  }

}