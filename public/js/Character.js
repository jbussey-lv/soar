class Character {

  constructor(name, img, width, height, center_of_gravity, position, orientation, 
              forces, velocity, mass, angular_velocity, moment_of_inertia){

    this.name = name;
    this.img = img;
    this.width = width;
    this.height = height;
    this.center_of_gravity = center_of_gravity;
    this.position = position;
    this._orientation = orientation * Math.PI / 180;
    this.forces = forces;
    this.velocity = velocity;
    this.mass = mass;
    this.angular_velocity = angular_velocity
    this.moment_of_intertia = moment_of_inertia;
  }

  get orientation(){
    return this._orientation * 180 / Math.PI;
  }

  set orientation(deg) {
    this._orientation = deg * Math.PI / 180;
  }

}