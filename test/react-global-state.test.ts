import { createStore } from '../src/react-global-state';

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('Exports create store', () => {
    expect(createStore).toBeTruthy();
  });
});
