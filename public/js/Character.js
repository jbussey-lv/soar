class Character {

  constructor(world, image, width, height, cog, mass, position, velocity, orientation, angular_velocity, key_listener){

    this.world              = world;
    this.image              = image;
    this.width              = width;
    this.height             = height;
    this.cog                = cog;
    this.mass               = mass;
    this.position           = position;
    this.velocity           = velocity;
    this.moment_of_inertia  = 1;
    this.orientation        = orientation;
    this.angular_velocity   = angular_velocity;
    this.key_listener       = key_listener;
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
    var da = new Angle();
    da.radians = interval * this.net_torque / this.moment_of_inertia;
    this.angular_velocity.add(da);
  }

  updateOrientation(interval){
    var da = new Angle();
    da.setEqualTo(this.angular_velocity);
    da.scale(interval)
    this.orientation.add(da);
  }

  get net_force(){
    var _net_force = new Vector();
    this.forces.forEach(function(force){
      _net_force.add(force.value);
    });
    return _net_force;
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