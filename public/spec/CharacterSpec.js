describe("Character", function() {

  var character;

  beforeEach(function() {
    
    character = new Character(
      world = {"gravity": 9.8, "characters": []},
      width = 10,
      height = 3,
      cog = new Vector([5, 2]),
      mass = 200,
      position = new Vector(20, 10),
      velocity = new Vector(),
      orientation = new Angle(),
      angular_velocity = 0,
      key_listener = new KeyListener()
    );

  });

  it("has just weight when no forces explicitly added", function() {

    var f = character.forces[0];

    expect(character.forces.length).toEqual(1);
    expect(f.value.isEqualTo(new Vector([0, 9.8*200]))).toBeTruthy();
  });

  it("has net force equal to weight when no forces explicitely added", function() {

    var f = character.forces[0];

    expect(character.net_force.isEqualTo(new Vector([0, 9.8*200]))).toBeTruthy();
  });

  it("has zero force when lift cancels weight", function() {

    var lift = new Force(
      character,
      character.cog,
      ()=>{return new Vector([0, -9.8*200])},
      "lift"
    );

    expect(character.net_force.magnitude).toBeCloseTo(0);
  });

  // it("has zero torque when lift forces cancel", function() {

  //   var a = new Force(
  //     character,
  //     character.cog.add(new Vector([5,5]),
  //     ()=>{return new Vector([4,-4])},
  //     "lift"
  //   );

  //   expect(character.net_force.magnitude).toBeCloseTo(0);
  // });

  // it("returns weight as net force when no other forces applied", function() {
  //   character.update();

  //   console.log(character.net_force, character.forces[0].value);

  //   expect(character.net_force.isEqualTo(character.forces[0].value)).toBeTruthy();
  // });

});
