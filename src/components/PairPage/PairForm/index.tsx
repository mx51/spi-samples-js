import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import {
  TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  TEXT_FORM_VALIDATION_POS_ID_TEXTFIELD,
  TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD,
  TEXT_FORM_VALIDATION_SERIAL_NUMBER_TEXTFIELD,
  TEXT_FORM_VALIDATION_EFTPOS_ADDRESS_TEXTFIELD,
  SPI_PAIR_STATUS,
} from '../../../definitions/constants/commonConfigs';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  selectPairFormDeviceAddress,
  selectPairFormSerialNumber,
} from '../../../redux/reducers/PairFormSlice/PairFormSelectors';
import { updatePairFormParams } from '../../../redux/reducers/PairFormSlice/pairFormSlice';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import {
  handleConfigAddressChange,
  handleConfigTypeBlur,
  handleConfigTypeChange,
  handleModalClose,
  handleModalOpen,
  handlePosIdBlur,
  handlePosIdChange,
  handleProviderBlur,
  handleProviderChange,
  handleSerialNumberBlur,
  handleSerialNumberChange,
  handleTestModeChange,
  initialSpiFormData,
} from '../../../utils/common/pair/pairFormHelpers';
import {
  eftposAddressValidator,
  fieldRequiredValidator,
  serialNumberValidator,
} from '../../../utils/validators/pairFormValidators';
import CustomTextField from '../../CustomTextField';
import ErrorInputAdornment from '../../CustomTextField/ErrorInputAdornment';
import useStyles from './index.styles';
import { IFormEventCheckbox, IFormEventValue, ISPIFormData } from './interfaces';
import SPIModal from './SPIModal';

const PairForm: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  // spi pair form local storage tracker
  const [spi, setSpi] = useState<ISPIFormData>(initialSpiFormData);
  // read redux store states
  const pairFormDeviceAddress = useAppSelector(selectPairFormDeviceAddress);
  const pairFormSerialNumber = useAppSelector(selectPairFormSerialNumber);
  const terminal = useAppSelector(terminalInstance(pairFormSerialNumber)) as ITerminalProps;

  return (
    <Grid container direction="column" className={classes.formContainer}>
      <form autoComplete="off" className={classes.pairForm}>
        <Grid item className={classes.title}>
          <Typography variant="h6" component="h1">
            Configuration
          </Typography>
        </Grid>
        <Grid container direction="column">
          <Grid container direction="row" className={classes.fieldSpace}>
            <Grid item xs={10} className={classes.columnSpace}>
              <CustomTextField
                className={classes.paymentProvider}
                disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
                error={!spi.provider.isValid}
                fullWidth
                helperText={
                  !spi.provider.isValid
                    ? TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD
                    : 'Type or select using our Simple Payments Integration (SPI)'
                }
                id="paymentProviderField"
                InputProps={{
                  endAdornment: <ErrorInputAdornment isValid={!spi.provider.isValid} />,
                }}
                label="Payment provider"
                margin="dense"
                onBlur={(event: IFormEventValue) => {
                  dispatch(
                    updatePairFormParams({
                      key: 'acquirerCode',
                      value: {
                        value: event.target.value as string,
                        isValid: fieldRequiredValidator(event.target.value as string),
                      },
                    })
                  );
                  handleProviderBlur(setSpi, 'provider', fieldRequiredValidator)(event);
                }}
                onChange={(event: IFormEventValue) =>
                  handleProviderChange(
                    setSpi,
                    'provider',
                    fieldRequiredValidator
                  )(event.target.value as unknown as string)
                }
                required
                value={spi.provider.value}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                className={classes.spiBtn}
                color="primary"
                disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
                fullWidth
                id="spiButton"
                onClick={() => handleModalOpen(setSpi, 'provider')}
                variant="contained"
              >
                SPI
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row" className={classes.fieldSpace}>
            <Grid item sm={6} xs={12} className={classes.columnSpace}>
              <FormControl variant="outlined" margin="dense" fullWidth>
                <InputLabel id="configurationLabel">Configuration option</InputLabel>
                <Select
                  className={classes.configurationField}
                  disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
                  id="configurationField"
                  label="Configuration option"
                  labelId="configurationDropdownLabel"
                  onBlur={(event: IFormEventValue) => {
                    dispatch(
                      updatePairFormParams({
                        key: 'addressType',
                        value: event.target.value as string,
                      })
                    );
                    handleConfigTypeBlur(setSpi, 'testMode')(event);
                  }}
                  onChange={(event: IFormEventValue) => handleConfigTypeChange(setSpi, 'configuration')(event)}
                  value={spi.configuration.type}
                >
                  <MenuItem value={TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE}>Auto address</MenuItem>
                  <MenuItem value={TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE}>EFTPOS address</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
              <CustomTextField
                disabled={
                  spi.configuration.type === TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE ||
                  terminal?.status === SPI_PAIR_STATUS.PairedConnecting
                }
                error={!spi.configuration.isValid}
                fullWidth
                helperText={!spi.configuration.isValid ? TEXT_FORM_VALIDATION_EFTPOS_ADDRESS_TEXTFIELD : ''}
                id="eftposAddressField"
                InputProps={{
                  endAdornment: <ErrorInputAdornment isValid={!spi.configuration.isValid} />,
                }}
                label="EFTPOS address"
                margin="dense"
                onBlur={(event: IFormEventValue) => {
                  dispatch(
                    updatePairFormParams({
                      key: 'deviceAddress',
                      value: {
                        value: event.target.value as string,
                        isValid: eftposAddressValidator(spi.configuration.type, event.target.value as string),
                      },
                    })
                  );
                }}
                onChange={(event: IFormEventValue) =>
                  handleConfigAddressChange(setSpi, 'configuration', () =>
                    eftposAddressValidator(spi.configuration.type, event.target.value as string)
                  )(event.target.value as string)
                }
                value={
                  (spi.configuration.type === TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE &&
                    terminal?.status === SPI_PAIR_STATUS.PairedConnecting) ||
                  terminal?.status === SPI_PAIR_STATUS.PairedConnected
                    ? pairFormDeviceAddress
                    : spi.configuration.value
                }
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid item className={classes.fieldSpace}>
            <CustomTextField
              disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
              error={!spi.serialNumber.isValid}
              fullWidth
              helperText={!spi.serialNumber.isValid ? TEXT_FORM_VALIDATION_SERIAL_NUMBER_TEXTFIELD : ''}
              id="serialNumberField"
              InputProps={{
                endAdornment: <ErrorInputAdornment isValid={!spi.serialNumber.isValid} />,
              }}
              label="Serial number"
              margin="dense"
              onBlur={(event: IFormEventValue) => {
                dispatch(
                  updatePairFormParams({
                    key: 'serialNumber',
                    value: {
                      value: event.target.value as string,
                      isValid: serialNumberValidator(event.target.value as string),
                    },
                  })
                );
                handleSerialNumberBlur(setSpi, 'serialNumber', serialNumberValidator)(event);
              }}
              onChange={(event: IFormEventValue) => handleSerialNumberChange(setSpi, 'serialNumber')(event)}
              required
              value={spi.serialNumber.value}
              variant="outlined"
            />
          </Grid>
          <Grid item className={classes.fieldSpace}>
            <CustomTextField
              disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
              error={!spi.posId.isValid}
              fullWidth
              helperText={!spi.posId.isValid ? TEXT_FORM_VALIDATION_POS_ID_TEXTFIELD : ''}
              id="posIdField"
              InputProps={{
                endAdornment: <ErrorInputAdornment isValid={!spi.posId.isValid} />,
              }}
              label="POS ID"
              margin="dense"
              onChange={(event: IFormEventValue) => handlePosIdChange(setSpi, 'posId')(event)}
              onBlur={(event: IFormEventValue) => {
                handlePosIdBlur(setSpi, 'posId', fieldRequiredValidator)(event);
                dispatch(
                  updatePairFormParams({
                    key: 'posId',
                    value: {
                      value: event.target.value as string,
                      isValid: fieldRequiredValidator(event.target.value as string),
                    },
                  })
                );
              }}
              required
              value={spi.posId.value}
              variant="outlined"
            />
          </Grid>
          <Grid item className={classes.fieldSpace}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={spi.testMode}
                  color="primary"
                  disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
                  id="testModeCheckbox"
                  name="testMode"
                  onChange={(event: IFormEventCheckbox) => {
                    dispatch(
                      updatePairFormParams({
                        key: 'testMode',
                        value: event.target.checked,
                      })
                    );
                    handleTestModeChange(setSpi, 'testMode')(event);
                  }}
                />
              }
              label="Test mode"
            />
          </Grid>
        </Grid>
      </form>
      {spi.provider.modalToggle && (
        <SPIModal
          handleProviderChange={(value: string) =>
            handleProviderChange(setSpi, 'provider', fieldRequiredValidator)(value)
          }
          modalToggle={spi.provider.modalToggle}
          onClose={(newValue: string) => handleModalClose(setSpi, 'provider')(newValue)}
          providerValue={spi.provider.value}
        />
      )}
    </Grid>
  );
};

export default PairForm;
