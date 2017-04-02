class Character {

  constructor(name, img, width, height, cog, position, orientation, 
              forces, velocity, mass, angular_velocity, key_listener){

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
    this.key_listener = key_listener;
    this.moment_of_intertia = 0.01 * mass * (width/2) * (width/2)
    this.forces = [];
    this.net_force = Vector.create();
    this.netTorque = 0;
    this.setForces(forces);
  }

  setForces(forces){
    var obj = this;
    forces.forEach(function(force){
      obj.forces.push(force);
      force.character = obj;
      force.updateRelativePosition();
      force.updateRelativeCogOffset();
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
    var net_torque = 0;
    this.forces.forEach(function(force){
      net_torque += force.torque;
    });
    this.net_torque = net_torque;
  }

  updateAngularVelocity(interval){
    this.angular_velocity += interval * this.net_torque / this.moment_of_intertia;
    this.angular_velocity *= 0.95;
  }

  updateOrientation(interval){
    this.orientation += interval * this.angular_velocity;
  }

  updateNetForce(){
    var net_force = this.net_force;
    net_force.setXY(0,0);
    this.forces.forEach(function(force){
      net_force.add(force.translation_component);
    });
  }

  updateVelocity(interval){
    this.velocity.add(this.net_force, interval / this.mass);
    this.velocity.multiply(0.999);
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