import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import Setting from '../src/Setting';
import Vec from '../src/Vec';
import Plane from '../src/Plane';
import Engine from '../src/Engine';

chai.use(chaiAlmost());

function getBasicPlane(): Plane {

  return new Plane(
    Vec.n(), // pos
    Vec.n(), // vel
    0, // ang
    0, // angVel
    Vec.n(8, 2), // cog
    new Setting()
  );
}

describe('Plane', () => {

  describe('Position Velocity', () => {

    it('shows zero for all positions when not moving and not rotating', () => {

      let plane: Plane = getBasicPlane();

      let posVel = plane.getAbsVel(Vec.n(0,0));
      expect(plane.getAbsVel(Vec.n(0,0))).to.deep.equal(Vec.n());
      expect(plane.getAbsVel(Vec.n(1,0))).to.deep.equal(Vec.n());
      expect(plane.getAbsVel(Vec.n(0,1))).to.deep.equal(Vec.n());
      expect(plane.getAbsVel(Vec.n(-1, 0))).to.deep.equal(Vec.n());
      expect(plane.getAbsVel(Vec.n(0,-1))).to.deep.equal(Vec.n());
      expect(plane.getAbsVel(Vec.n(5,5))).to.deep.equal(Vec.n());
    });



    it('shows correct for just rotating', () => {

      let angVel: number = 2 * Math.PI;

      let plane: Plane = getBasicPlane();
      plane.cog = Vec.n(0,0);
      plane.angVel = angVel;

      expect(plane.getAbsVel(Vec.n(1,0))).to.be.deep.almost(Vec.n(0, angVel));
      expect(plane.getAbsVel(Vec.n(0,1))).to.be.deep.almost(Vec.n(-angVel, 0));
      expect(plane.getAbsVel(Vec.n(-1,0))).to.be.deep.almost(Vec.n(0, -angVel));
      expect(plane.getAbsVel(Vec.n(0,-1))).to.be.deep.almost(Vec.n(angVel, 0));
    });


    it('shows correct for all complex plane stationary', () => {
      chai.use(chaiAlmost(0.1));
      let plane = getBasicPlane();
      plane.ang = Math.PI/6;
      plane.angVel = Math.PI/4;
      plane.cog = Vec.n(2, 1);

      expect(plane.getAbsVel(Vec.n(5,2))).to.be.deep.almost(Vec.n(-1.854, 1.651));
    });


    it('shows correct for all complex plane moving', () => {
      chai.use(chaiAlmost(0.1));
      let plane: Plane = getBasicPlane();
      plane.vel = Vec.n(20,10);
      plane.ang = Math.PI/6;
      plane.angVel = Math.PI/4;
      plane.cog = Vec.n(2, 1);

      expect(plane.getAbsVel(Vec.n(5,2))).to.be.deep.almost(Vec.n(20-1.854, 10+1.651));
      expect(plane.getAbsVel(Vec.n(-1,0))).to.be.deep.almost(Vec.n(20+1.854, 10-1.651));
    });
  })
});
