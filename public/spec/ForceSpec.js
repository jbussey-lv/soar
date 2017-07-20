describe("Force", function() {

  var force;

  beforeEach(function() {
    force = new Force();
  });

  it("returns 0 for toque when no displacement", function() {
    force.offset.xy = [0,0];
    force.value.xy = [5,3];
    force.updateTranslationAndTorque();

    expect(force.torque).toEqual(0);
  });

  it("returns 0 for toque when offset same direction as value", function() {
    force.offset.xy = [2,3];
    force.value.xy = [4,6];
    force.updateTranslationAndTorque();

    expect(force.torque).toEqual(0);
  });

  it("returns full force value for translation when offset same direction as value", function() {
    force.offset.xy = [2,3];
    force.value.xy = [4,6];
    force.updateTranslationAndTorque();

    expect(force.translation.isEqualTo(force.value)).toBeTruthy();
  });

  it("returns 0 for translation when offset perpendicular to value", function() {
    force.offset.xy = [4, -3];
    force.value.xy = [3, 4];
    force.updateTranslationAndTorque();

    expect(force.translation.magnitude).toBeCloseTo(0);
  });

  it("returns full magnitude for torque when offset perpendicular to value", function() {
    force.offset.xy = [4, -3];
    force.value.xy = [3, 4];
    force.updateTranslationAndTorque();

    expect(force.torque).toBeCloseTo(25);
  });

  it("returns positive torque when counterclockwise", function() {
    force.offset.xy = [4, -3];
    force.value.xy = [3, 4];
    force.updateTranslationAndTorque();

    expect(force.torque).toBeGreaterThan(0);
  });

  it("returns negative torque when clockwise", function() {
    force.offset.xy = [3, 4];
    force.value.xy = [4, -3];
    force.updateTranslationAndTorque();

    expect(force.torque).toBeLessThan(0);
  });

  it("returns correct values for scew offset vs value", function() {
    force.offset.xy = [4, 4];
    force.value.xy = [3, 0];
    force.updateTranslationAndTorque();

    expect(force.torque).toBeCloseTo(-1 * Math.sqrt(4.5) * Math.sqrt(32));
    expect(force.translation.x).toBeCloseTo(1.5);
    expect(force.translation.y).toBeCloseTo(1.5);
  });

});