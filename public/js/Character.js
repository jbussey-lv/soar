class Character {

  constructor(world, width, height, cog, mass, position, velocity, orientation, angular_velocity, key_listener){

    this.world              = world;
    this.width              = width;
    this.height             = height;
    this.cog                = cog;
    this.mass               = mass;
    this.position           = position || new Vector();
    this.velocity           = velocity || new Vector();
    this.moment_of_inertia  = 1;
    this.orientation        = orientation || new Angle();
    this.angular_velocity   = angular_velocity || 0;
    this.key_listener       = key_listener || new KeyListener();
    this.forces             = [];

    // add in weight
    var weight = new Force(
      this,
      this.cog,
      ()=>{return new Vector([0, this.world.gravity * this.mass])},
      "weight"
    );

    this.world.characters.push(this);
  }


  update(interval){

    this.updateAngularVelocity(interval);
    this.updateOrientation(interval);

    this.updateVelocity(interval);
    this.updatePosition(interval);
  }

  get net_torque(){
    var _net_torque = 0;
    this.forces.forEach(function(force){
      _net_torque += force.torque;
    });
    return _net_torque;
  }

  updateAngularVelocity(interval){
    this.angular_velocity += interval * this.net_torque / this.moment_of_intertia;
  }

  updateOrientation(interval){
    this.orientation += interval * this.angular_velocity;
  }

  get net_force(){
    var _net_force = new Vector();
    character.forces.forEach(function(force){
      _net_force.add(force.translation);
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
    var dp = new Vector();
    dp.setEqualTo(this.velocity)
      .scale(interval);
    this.position.add(dp);
  }


}