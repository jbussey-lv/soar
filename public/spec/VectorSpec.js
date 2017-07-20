describe("Vector", function() {

  var vector;

  beforeEach(function() {
    vector = new Vector();
  });

  it("return 0 for magnitude and angle when initialized empty", function() {
    expect(vector.magnitude).toEqual(0);
    expect(vector.angle.degrees).toEqual(0);
  });

  it("converts between cartesian and polar coordinates", function() {
    vector.xy = [2,1];
    expect(vector.magnitude).toEqual(Math.sqrt(5));
    expect(vector.angle.radians).toBeCloseTo(0.463);
  });

  it("converts between polar and cartesian coordinates", function() {
    vector.magnitude = 5;
    vector.angle.degrees = 20;
    expect(vector.x).toBeCloseTo(4.698);
    expect(vector.y).toBeCloseTo(1.710);
  });

  it("sets value from sum of other vectors", function() {
    var v1 = new Vector([2, 3]);
    var v2 = new Vector([4, 6]);
    var v3 = new Vector([9, -2]);
    var v4 = new Vector([-3, 4]);

    vector.sumFromSet([v1,v2,v3,v4]);

    expect(vector.x).toBeCloseTo(12);
    expect(vector.y).toBeCloseTo(11);
  });

  it("scales correctly", function() {
    vector.xy = [5,6];
    vector.scale(3);

    expect(vector.x).toBeCloseTo(15);
    expect(vector.y).toBeCloseTo(18);
  });

  it("reverses correctly", function() {
    vector.xy = [5,6];
    vector.reverse();

    expect(vector.x).toBeCloseTo(-5);
    expect(vector.y).toBeCloseTo(-6);
  });

  it("adds correctly", function() {
    vector.xy = [5,6];
    v2 = new Vector([3,8]);
    vector.add(v2);

    expect(vector.x).toBeCloseTo(8);
    expect(vector.y).toBeCloseTo(14);
  });

  it("subtracts correctly", function() {
    vector.xy = [5,6];
    v2 = new Vector([3,8]);
    vector.subtract(v2);

    expect(vector.x).toBeCloseTo(2);
    expect(vector.y).toBeCloseTo(-2);
  });

});
