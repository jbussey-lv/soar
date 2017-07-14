describe("Force", function() {

  var force;

  beforeEach(function() {
    force = new Force();
  });

  it("returns 0 for toque when no displacement", function() {
    force.offset.xy = [0,0];
    force.value.xy = [5,3];

    expect(force.torque()).toEqual(0);
  });

  it("returns 0 for toque when offset same direction as value", function() {
    force.offset.xy = [2,3];
    force.value.xy = [4,6];

    expect(force.torque()).toEqual(0);
  });

  it("returns full force value for translation when offset same direction as value", function() {
    force.offset.xy = [2,3];
    force.value.xy = [4,6];

    expect(force.translation().isEqualTo(force.value)).toBeTruthy();
  });

  it("returns 0 for translation when offset perpendicular to value", function() {
    force.offset.xy = [4, -3];
    force.value.xy = [3, 4];

    expect(force.translation().magnitude).toBeCloseTo(0);
  });

  it("contributes full magnitude for torque when offset perpendicular to value", function() {
    force.offset.xy = [4, -3];
    force.value.xy = [3, 4];

    expect(force.torque()).toBeCloseTo(25);
  });

  it("gives positive torque when counterclockwise", function() {
    force.offset.xy = [4, -3];
    force.value.xy = [3, 4];

    expect(force.torque()).toBeGreaterThan(0);
  });

  it("gives negative torque when clockwise", function() {
    force.offset.xy = [3, 4];
    force.value.xy = [4, -3];

    expect(force.torque()).toBeLessThan(0);
  });


});
