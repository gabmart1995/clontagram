import { NoLoggedMiddleware } from './nologged.middleware';

describe('NologgedMiddleware', () => {
  it('should be defined', () => {
    expect(new NoLoggedMiddleware()).toBeDefined();
  });
});
