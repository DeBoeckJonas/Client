import { StatsToPercent } from './stats-to-percent';

describe('statsToPercentPipe', () => {
  it('create an instance', () => {
    const pipe = new StatsToPercent();
    expect(pipe).toBeTruthy();
  });
});
