import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import Setting from '../src/Setting';
import Vec from '../src/Vec';
import Plane from '../src/Plane';

chai.use(chaiAlmost());

describe('Plane', () => {

  let setting = new Setting();

  describe('Position Velocity', () => {

    it('shows zero for all positions when not moving and not rotating', () => {

      let plane = new Plane(Vec.n(), Vec.n(), 0, 0, Vec.n(), setting);
      let posVel = plane.getPosVelocity(Vec.n(0,0));
      expect(plane.getPosVelocity(Vec.n(0,0))).to.deep.equal(Vec.n());
      expect(plane.getPosVelocity(Vec.n(1,0))).to.deep.equal(Vec.n());
      expect(plane.getPosVelocity(Vec.n(0,1))).to.deep.equal(Vec.n());
      expect(plane.getPosVelocity(Vec.n(-1, 0))).to.deep.equal(Vec.n());
      expect(plane.getPosVelocity(Vec.n(0,-1))).to.deep.equal(Vec.n());
      expect(plane.getPosVelocity(Vec.n(5,5))).to.deep.equal(Vec.n());
    });



    it('shows correct for just rotating', () => {

      let plane = new Plane(Vec.n(), Vec.n(), 0, 2*Math.PI, Vec.n(), setting);

      expect(plane.getPosVelocity(Vec.n(1,0))).to.be.deep.almost(Vec.n(0, 2*Math.PI));
      expect(plane.getPosVelocity(Vec.n(0,1))).to.be.deep.almost(Vec.n(-2*Math.PI, 0));
      expect(plane.getPosVelocity(Vec.n(-1,0))).to.be.deep.almost(Vec.n(0, -2*Math.PI));
      expect(plane.getPosVelocity(Vec.n(0,-1))).to.be.deep.almost(Vec.n(2*Math.PI, 0));
    });


    it('shows correct for all complex plane stationary', () => {
      chai.use(chaiAlmost(0.1));
      let plane = new Plane(Vec.n(), Vec.n(), Math.PI/6, Math.PI/4, Vec.n(2, 1), setting);

      expect(plane.getPosVelocity(Vec.n(5,2))).to.be.deep.almost(Vec.n(-1.854, 1.651));
    });


    it('shows correct for all complex plane moving', () => {
      chai.use(chaiAlmost(0.1));
      let plane = new Plane(Vec.n(), Vec.n(20,10), Math.PI/6, Math.PI/4, Vec.n(2, 1), setting);

      expect(plane.getPosVelocity(Vec.n(5,2))).to.be.deep.almost(Vec.n(20-1.854, 10+1.651));
      expect(plane.getPosVelocity(Vec.n(-1,0))).to.be.deep.almost(Vec.n(20+1.854, 10-1.651));
    });
  })
});
