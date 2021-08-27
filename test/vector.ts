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
  it('adds angle correctly', () => {
    const v1 = new Vector(3, 3);
    let v2 = v1.rotate(Math.PI / 2);
    expect(v2.angle).to.roughly.eql(3 * Math.PI / 4);
  });
  it('adds single vector on', () => {
    const v = new Vector(3, 4).add(new Vector(2,5));
    expect(v.x).to.eql(5);
    expect(v.y).to.eql(9);
  });
  it('adds multiple vectors on', () => {
    const v = new Vector(3, 4).add(new Vector(2,1), new Vector(6,5));
    expect(v.x).to.eql(11);
    expect(v.y).to.eql(10);
  });
  it('subtracts single vector off', () => {
    const v = new Vector(3, 4).subtract(new Vector(2,5));
    expect(v.x).to.eql(1);
    expect(v.y).to.eql(-1);
  });
  it('subtracts multiple vectors off', () => {
    const v = new Vector(3, 4).subtract(new Vector(2,1), new Vector(6,5));
    expect(v.x).to.eql(-5);
    expect(v.y).to.eql(-2);
  });
  it('creates a vector sum', () => {
    const v = Vector.sum(new Vector(3, 4), new Vector(2,1), new Vector(6,5));
    expect(v.x).to.eql(11);
    expect(v.y).to.eql(10);
  });
});