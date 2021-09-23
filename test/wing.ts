import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { WatchIgnorePlugin } from 'webpack';
import Vec from '../src/Vec';
import Wing from '../src/Wing';

chai.use(chaiAlmost());

function getBasicWing(): Wing {
  return new Wing(
    Vec.n(3,1), // pos: Vec;
    0, // angMid
    0, // angDiff
    1, // length
    1, // width
    ()=>1 // getControlVal
  );
}

describe('Wing', () => {
  describe('Force Magnitude', () => {
    it('shows no force front edge on', () => {
      let wing = getBasicWing();
      let force = wing.getForceMagnitude(1, 0, 1);
      expect(force).to.almost.equal(0);
    });
    it('shows no force back edge on', () => {
      let wing = getBasicWing();
      let force = wing.getForceMagnitude(1, Math.PI, 1);
      expect(force).to.almost.equal(0);
    });
    it('shows some force at 45 degrees', () => {
      let wing = getBasicWing();
      let force = wing.getForceMagnitude(1, Math.PI / 4, 1);
      expect(force).to.be.greaterThan(0);
    });
    it('shows more force at 90 degrees than at 45 degrees', () => {
      let wing = getBasicWing();
      let force90 = wing.getForceMagnitude(1, Math.PI / 2, 1);
      let force45 = wing.getForceMagnitude(1, Math.PI / 4, 1);
      expect(force90).to.be.greaterThan(force45);
    });
  })
});