import chai, { expect } from 'chai';
import chaiRoughly from 'chai-roughly';
import Vector from '../src/Vector';

chai.use(chaiRoughly);

describe('Vector', () => {
  it('can be initialized without arguments and set x and y to 0', () => {
    const v = new Vector();
    expect(v.x).to.equal(0);
    expect(v.y).to.equal(0);
  });
  it('returns magnitude equal to hypotenous', () => {
    const v = new Vector(3,4);
    expect(v.magnitude).to.equal(5);
  });
  it('returns angle correctly', () => {
    const v = new Vector(3, 4);
    expect(v.angle).to.roughly.eql(0.9272952);
  });
});