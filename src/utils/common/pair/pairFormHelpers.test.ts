import React from 'react';
import { cleanup } from '@testing-library/react';
import {
  SPI_PAIR_STATUS,
  TEXT_FORM_DEFAULT_OPTION,
  TEXT_FORM_MODAL_CODE_WESTPAC,
} from '../../../definitions/constants/commonConfigs';
import { disableProviderField } from './pairFormHelpers';

describe('Test pairFormHelpers()', () => {
  afterEach(cleanup);

  test('should return true when status is PairedConnecting during running disableProviderField()', () => {
    // Arrange
    const status = SPI_PAIR_STATUS.PairedConnecting;
    const spiProviderValue = TEXT_FORM_MODAL_CODE_WESTPAC;

    // Act
    const result = disableProviderField(status, spiProviderValue);

    // Assert
    expect(result).toBeTruthy();
  });

  test('should return false when status is Unpaired during running disableProviderField()', () => {
    // Arrange
    const status = SPI_PAIR_STATUS.Unpaired;
    const spiProviderValue = TEXT_FORM_DEFAULT_OPTION;

    // Act
    const result = disableProviderField(status, spiProviderValue);

    // Assert
    expect(result).toBeFalsy();
  });
});
