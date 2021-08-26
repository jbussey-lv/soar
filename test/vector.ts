import { expect } from 'chai';
import Vector from '../src/Vector';

describe('Vector', () => {
  it('can be initialized without arguments', () => {
    const v = new Vector();
    expect(v.x).to.equal(0);
    expect(v.y).to.equal(0);
  });
  it('returs magnitude equal to hypotenous', () => {
    const v = new Vector(3,4);
    expect(v.magnitude).to.equal(5);
  })
});