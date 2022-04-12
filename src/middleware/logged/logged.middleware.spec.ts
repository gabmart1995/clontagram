import { LoggedMiddleware } from './logged.middleware';

describe('LoggedMiddleware', () => {
  it('should be defined', () => {
    expect(new LoggedMiddleware()).toBeDefined();
  });
});
