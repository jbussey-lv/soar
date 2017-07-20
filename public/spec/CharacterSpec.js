describe("Character", function() {

  var character;

  beforeEach(function() {
    var cog = new Vector([20,5]);
    var mass = 800;
    

    character = new Character(cog, mass);
  });

  // it("return 0 for radians and degrees when initialized empty", function() {
  //   expect(angle.radians).toEqual(0);
  //   expect(angle.degrees).toEqual(0);
  // });

});
