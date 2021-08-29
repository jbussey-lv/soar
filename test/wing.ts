import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { WatchIgnorePlugin } from 'webpack';
import Vec from '../src/Vec';
import Wing from '../src/Wing';

chai.use(chaiAlmost());

describe('Wing', () => {
  describe('Force Magnitude', () => {
    it('shows no force front edge on', () => {
      let wing = new Wing(Vec.n(3,1), 0, 1, 1);
      let force = wing.getForceMagnitude(1, 0, 1);
      expect(force).to.almost.equal(0);
    });
    it('shows no force back edge on', () => {
      let wing = new Wing(Vec.n(3,1), 0, 1, 1);
      let force = wing.getForceMagnitude(1, Math.PI, 1);
      expect(force).to.almost.equal(0);
    });
  })
});