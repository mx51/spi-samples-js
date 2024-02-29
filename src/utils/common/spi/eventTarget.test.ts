import { cleanup } from '@testing-library/react';
import { spiEvents } from '../../../definitions/constants/commonConfigs';
import SpiEventTarget from './eventTarget';

describe('Test SpiEventTarget class', () => {
  const eventTarget = new SpiEventTarget();

  afterEach(cleanup);

  test('test function setEventMapper()', () => {
    // Arrange
    const mapper = undefined;

    // Act
    const result = eventTarget.setEventMapper(spiEvents.spiStatusChanged, mapper);

    // Assert
    expect(result()).toBeUndefined();
  });

  test('should return undefined when removeEventListener() does not have a correct type value passed in', () => {
    // Arrange
    const callback = jest.fn();

    // Act
    const result = eventTarget.removeEventListener('test', callback());

    // Assert
    expect(result).not.toBeDefined();
  });

  test('should return empty array when callback is matching with listeners type event during calling removeEventListener()', () => {
    // Arrange
    const callback = 'test';
    (eventTarget as Any).listeners.test = ['test'];

    // Act
    const result = eventTarget.removeEventListener('test', callback);

    // Assert
    expect(result).not.toBeDefined();
    expect((eventTarget as Any).listeners.test).toBeDefined();
    expect((eventTarget as Any).listeners.test.length).toEqual(0);
  });

  test('test function addEventListener()', () => {
    // Arrange
    const callback = 'test';
    (eventTarget as Any).listeners.test = [];

    // Act
    eventTarget.addEventListener('test', callback);

    // Assert
    expect((eventTarget as Any).listeners.test).toBeDefined();
    expect((eventTarget as Any).listeners.test.length).toEqual(1);
  });

  test('should return tru when event type is not defined during calling dispatchEvent()', () => {
    // Arrange
    const event = {
      type: null,
    };

    // Act
    const result = eventTarget.dispatchEvent(event);

    // Assert
    expect(result).toBeTruthy();
  });
});
