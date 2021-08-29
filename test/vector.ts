import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import Vec from '../src/Vec';

chai.use(chaiAlmost());

describe('Vector', () => {
  it('can be initialized without arguments and set x and y to 0', () => {
    const v = new Vec();
    expect(v.x).to.equal(0);
    expect(v.y).to.equal(0);
  });
  it('returns magnitude equal to hypotenous', () => {
    const v = new Vec(3,4);
    expect(v.magnitude).to.equal(5);
  });
  it('returns angle correctly', () => {
    const v = new Vec(3, 4);
    expect(v.angle).to.almost.eql(0.9272952);
  });
  it('adds angle correctly', () => {
    const v1 = new Vec(3, 3);
    let v2 = v1.rotate(Math.PI / 2);
    expect(v2.angle).to.almost.eql(3 * Math.PI / 4);
  });
  it('adds single vector on', () => {
    const v = new Vec(3, 4).add(new Vec(2,5));
    expect(v.x).to.eql(5);
    expect(v.y).to.eql(9);
  });
  it('adds multiple vectors on', () => {
    const v = new Vec(3, 4).add(new Vec(2,1), new Vec(6,5));
    expect(v.x).to.eql(11);
    expect(v.y).to.eql(10);
  });
  it('subtracts single vector off', () => {
    const v = new Vec(3, 4).subtract(new Vec(2,5));
    expect(v.x).to.eql(1);
    expect(v.y).to.eql(-1);
  });
  it('subtracts multiple vectors off', () => {
    const v = new Vec(3, 4).subtract(new Vec(2,1), new Vec(6,5));
    expect(v.x).to.eql(-5);
    expect(v.y).to.eql(-2);
  });
  it('creates a vector sum', () => {
    const v = Vec.sum(new Vec(3, 4), new Vec(2,1), new Vec(6,5));
    expect(v.x).to.eql(11);
    expect(v.y).to.eql(10);
  });
});