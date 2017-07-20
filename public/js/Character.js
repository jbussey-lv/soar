class Character {

  constructor(cog, mass, forces, key_listener){

    this.cog                = cog || new Vector();
    this.mass               = mass || 1;
    this.key_listener       = key_listener;
    this.forces             = forces || [];

    this.customizeForces();

    this.position           = new Vector();
    this.velocity           = new Vector();
    this.moment_of_intertia = 0.01 * mass * (width/2) * (width/2)
    this.orientation        = new Angle();
    this.angular_velocity   = 0;

  }

  customizeForces() {

    // add in gravity
    var weight = new Force(
      this.cog,
      function(){this.value.y = this.character.mass * this.character.world.g;}
    );
    this.forces.push(weight);
    var character = this;
    this.forces.forEach(function(force){
      force.character = character;
    });
  }


  update(interval){
    // update all forces
    this.forces.forEach(function(force){
      force.update();
    });

    this.updateNetTorque();
    this.updateAngularVelocity(interval);
    this.updateOrientation(interval);

    this.updateNetForce();
    this.updateVelocity(interval);
    this.updatePosition(interval);
  }

  updateNetTorque(){
    this.net_torque = 0;
    this.forces.forEach(function(force){
      net_torque += force.torque;
    });
  }

  updateAngularVelocity(interval){
    this.angular_velocity += interval * this.net_torque / this.moment_of_intertia;
    this.angular_velocity *= 0.95;
  }

  updateOrientation(interval){
    this.orientation += interval * this.angular_velocity;
  }

  updateNetForce(){
    this.net_force.setXY(0,0);
    this.forces.forEach(function(force){
      this.net_force.add(force.translation);
    });
  }

  updateVelocity(interval){
    var dv = new Vector();
    dv.setEqualTo(this.net_force)
      .scale(1 / this.mass)
      .scale(interval);
    this.velocity.add(dv);
  }

  updatePosition(interval){
    this.position.add(this.velocity, interval);
  }

  get orientation(){
    return this._orientation * 180 / Math.PI;
  }

  set orientation(deg) {
    this._orientation = deg * Math.PI / 180;
  }

}