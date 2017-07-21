describe("Force", function() {

  var force;

  beforeEach(function() {

    var character = {
      "position": new Vector(),
      "cog": new Vector(),
      "orientation": new Angle(),
      "forces": []
    }

    var initial_position = new Vector();

    var getValue = () => {return new Vector();};

    force = new Force(character, initial_position, getValue);
  });

  it("returns 0 for toque when no displacement", function() {
    force.character.cog.xy = [15,10];
    force.initial_position.xy = [15,10];
    force.getValue = () => {return new Vector([30, 20]);};

    expect(force.torque).toBeCloseTo(0);
  });

  it("returns 0 for toque when offset same direction as value", function() {
    force.character.cog.xy = [1,1];
    force.initial_position.xy = [31,21];
    force.getValue = () => {return new Vector([60, 40]);};

    expect(force.torque).toBeCloseTo(0);
  });

  it("returns full magnitude for torque when offset perpendicular to value", function() {

    force.character.cog.xy = [1,1];
    force.initial_position.xy = [5,4];
    force.getValue = () => {return new Vector([-3, 4]);};

    expect(force.torque).toBeCloseTo(25);
  });

  it("returns positive torque when clockwise", function() {

    force.initial_position.xy = [4,-3];
    force.getValue = () => {return new Vector([3, 4]);};

    expect(force.torque).toBeGreaterThan(0);
  });

  it("returns negative torque when counterclockwise", function() {

    force.initial_position.xy = [3,4];
    force.getValue = () => {return new Vector([4, -3]);};

    expect(force.torque).toBeLessThan(0);
  });

  it("returns correct torque for scew offset force", function() {

    force.initial_position.xy = [4,4];
    force.getValue = () => {return new Vector([3,0]);};

    expect(force.torque).toBeCloseTo(-1 * Math.sqrt(4.5) * Math.sqrt(32));
  });

});
