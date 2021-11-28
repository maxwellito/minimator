import { after, before, describe, spyOn, Mock, resetAllMocks, it, assert } from '../tests/lib.js';
import { timeago } from './utils.js';

describe('timeago', () => {
  var dateMock: Mock;
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  before(() => {
    dateMock = spyOn(Date, 'now');
    dateMock.andReturn(0);
  });
  after(() => {
    resetAllMocks();
  });

  it('should return "right now" short duration', () => {
    assert(timeago(0), 'just now');
    assert(timeago(-1000), 'just now');
  });

  it('should display the duration in seconds if under a minute', () => {
    assert(timeago(-2 * 1000), '2s ago');
    assert(timeago(-50 * 1000), '50s ago');
  });

  it('should display the duration in minutes if under an hour', () => {
    assert(timeago(-minute), '1min ago');
    assert(timeago(-10 * minute + 1), '9min ago');
    assert(timeago(-50 * minute), '50min ago');
  });

  it('should display the duration in hours if under a day', () => {
    assert(timeago(-hour), '1h ago');
    assert(timeago(-10 * hour + 1), '9h ago');
    assert(timeago(-23 * hour), '23h ago');
  });

  it('should display the duration in days if under a month', () => {
    assert(timeago(-day), '1 day ago');
    assert(timeago(-20 * day + 1), '19 days ago');
    assert(timeago(-20 * day), '20 days ago');
  });

  it('should display the duration in month if under a year', () => {
    assert(timeago(-month), '1 month ago');
    assert(timeago(-10 * month + 1), '9 months ago');
    assert(timeago(-10 * month), '10 months ago');
  });

  it('should display the duration in years if above a year', () => {
    assert(timeago(-year), '1 year ago');
    assert(timeago(-10 * year + 1), '9 years ago');
    assert(timeago(-10 * year), '10 years ago');
  });
})