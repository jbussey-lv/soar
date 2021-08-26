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
  it('sets magnitude', () => {
    const v = new Vector(3, 4);
    v.magnitude = 15;
    expect(v.magnitude).to.eql(15);
    expect(v.x).to.eql(9);
    expect(v.y).to.eql(12);
  });
  it('mutliplies magnitude', () => {
    const v = new Vector(3, 4);
    v.magnitude *= 2
    expect(v.magnitude).to.eql(10);
    expect(v.x).to.eql(6);
    expect(v.y).to.eql(8);
  });
  it('adds magnitude', () => {
    const v = new Vector(3, 4);
    v.magnitude += 15
    expect(v.magnitude).to.eql(20);
    expect(v.x).to.eql(12);
    expect(v.y).to.eql(16);
  });
  it('sets angle', () => {
    const v = new Vector(3, 4);
    v.angle = (Math.PI / 4);
    expect(v.x).to.roughly.eql(Math.sqrt(12.5));
    expect(v.y).to.roughly.eql(Math.sqrt(12.5));
    expect(v.magnitude).to.roughly.eql(5);
    expect(v.angle).to.roughly.eql(Math.PI / 4);
  });
  it('adds multiple vectors on', () => {
    const v = new Vector(3, 4).add(new Vector(2,1), new Vector(6,5));
    expect(v.x).to.eql(11);
    expect(v.y).to.eql(10);
  });
});