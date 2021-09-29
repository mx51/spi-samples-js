import { getLocalStorage, setLocalStorage, removeItemFromLocalStorage } from './common';

describe('Test spi common functions', () => {
  test('should be able to setLocalStorage and getLocalStorage', () => {
    // Arrange
    setLocalStorage('test', 'test');
    const testStorage = getLocalStorage('test');

    // Assert
    expect(testStorage).toEqual('test');
  });

  test('should removeItemFromLocalStorage', () => {
    // Arrange
    removeItemFromLocalStorage('test');
    const testStorage = getLocalStorage('test');

    // Assert
    expect(testStorage).toBeNull();
  });
});
