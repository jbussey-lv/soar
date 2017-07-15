class Character {

  constructor(cog, mass, forces, key_listener){

    this.cog                = cog || new Vector();
    this.mass               = mass || 1;
    this.forces             = forces || [];
    this.key_listener       = key_listener;

    this.position           = new Vector();
    this.velocity           = new Vector();
    this.moment_of_intertia = 0.01 * mass * (width/2) * (width/2)
    this.orientation        = new Angle();
    this.angular_velocity   = 0;

    this.customizeForces()
  }

  customizeForces() {



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