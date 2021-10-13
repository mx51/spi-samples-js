import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import {
  SPI_PAIR_STATUS,
  TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  TEXT_FORM_DEFAULT_OPTION,
  TEXT_FORM_DEFAULT_VALUE,
  TEXT_FORM_MODAL_CODE_TILL,
  TEXT_FORM_MODAL_CODE_WESTPAC,
  TEXT_FORM_VALIDATION_EFTPOS_ADDRESS_TEXTFIELD,
  TEXT_FORM_VALIDATION_POS_ID_TEXTFIELD,
  TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD,
  TEXT_FORM_VALIDATION_SERIAL_NUMBER_TEXTFIELD,
} from '../../../../definitions/constants/commonConfigs';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { selectPairFormDeviceAddress } from '../../../../redux/reducers/PairFormSlice/PairFormSelectors';
import { updatePairFormParams } from '../../../../redux/reducers/PairFormSlice/pairFormSlice';
import {
  handleDeviceAddressOnChange,
  handleDeviceAddressTypeOnChange,
  handleDeviceAddressTypeOnBlur,
  handlePaymentProviderOnBlur,
  handlePaymentProviderOnChange,
  handlePosIdChange,
  handleProviderOnChange,
  handleSerialNumberChange,
  handleDeviceAddressOnBlur,
  handleSerialNumberOnBlur,
  handlerPosIdOnBlur,
  handleTestModeOnChange,
} from '../../../../utils/common/pair/pairFormHelpers';
import {
  eftposAddressValidator,
  fieldRequiredValidator,
  serialNumberValidator,
} from '../../../../utils/validators/pairFormValidators';
import CustomTextField from '../../../CustomTextField';
import ErrorInputAdornment from '../../../CustomTextField/ErrorInputAdornment';
import useStyles from '../index.styles';
import { IFormEventCheckbox, IFormEventValue, IPairFormState } from '../interfaces';

export default function PairConfiguration({ setSpi, spi, terminal }: IPairFormState): React.ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const pairFormDeviceAddress = useAppSelector(selectPairFormDeviceAddress);

  return (
    <>
      <Grid item className={classes.title}>
        <Typography variant="h6" component="h1" className={classes.configurationTitle}>
          Pairing configuration
        </Typography>
      </Grid>
      <Grid container direction="column">
        <Grid container direction="row" className={classes.fieldSpace}>
          <Grid item sm={6} xs={12} className={classes.columnSpace}>
            <FormControl variant="outlined" margin="dense" fullWidth data-test-id="paymentProviderSelector">
              <InputLabel data-test-id="paymentProviderLabel">Payment provider</InputLabel>
              <Select
                className={classes.pairFormSelector}
                data-test-id="paymentProviderSelector"
                disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
                label="Payment provider"
                labelId="paymentProviderSelectorLabel"
                onChange={(event: IFormEventValue) =>
                  handlePaymentProviderOnChange(dispatch, event, fieldRequiredValidator, setSpi, updatePairFormParams)
                }
                value={spi.provider.option}
              >
                <MenuItem value={TEXT_FORM_DEFAULT_OPTION}>Payment provider</MenuItem>
                <MenuItem value={TEXT_FORM_MODAL_CODE_TILL}>Till Payments</MenuItem>
                <MenuItem value={TEXT_FORM_MODAL_CODE_WESTPAC}>Westpac</MenuItem>
                <MenuItem value={TEXT_FORM_DEFAULT_VALUE}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <CustomTextField
              dataTestId="paymentProviderField"
              disabled={
                spi.provider.option !== TEXT_FORM_DEFAULT_VALUE || terminal?.status === SPI_PAIR_STATUS.PairedConnecting
              }
              error={!spi.provider.isValid}
              fullWidth
              helperText={!spi.provider.isValid ? TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD : ''}
              InputProps={{
                endAdornment: <ErrorInputAdornment isValid={!spi.provider.isValid} />,
              }}
              label={TEXT_FORM_DEFAULT_VALUE}
              margin="dense"
              onBlur={(event: IFormEventValue) =>
                handlePaymentProviderOnBlur(dispatch, event, fieldRequiredValidator, setSpi, updatePairFormParams)
              }
              onChange={(event: IFormEventValue) =>
                handleProviderOnChange(
                  setSpi,
                  'provider',
                  fieldRequiredValidator
                )(event.target.value as unknown as string)
              }
              value={spi.provider.value}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.fieldSpace}>
          <Grid item sm={6} xs={12} className={classes.columnSpace}>
            <FormControl variant="outlined" margin="dense" fullWidth data-test-id="configurationTypeSelector">
              <InputLabel data-test-id="configurationLabel">Configuration option</InputLabel>
              <Select
                className={classes.pairFormSelector}
                data-test-id="configurationSelector"
                disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
                label="Configuration option"
                labelId="configurationDropdownLabel"
                onBlur={(event: IFormEventValue) =>
                  handleDeviceAddressTypeOnBlur(dispatch, event, setSpi, updatePairFormParams)
                }
                onChange={(event: IFormEventValue) => handleDeviceAddressTypeOnChange(setSpi, 'configuration')(event)}
                value={spi.configuration.type}
              >
                <MenuItem value={TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE}>Auto address</MenuItem>
                <MenuItem value={TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE}>EFTPOS address</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <CustomTextField
              dataTestId="eftposAddressField"
              disabled={
                spi.configuration.type === TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE ||
                terminal?.status === SPI_PAIR_STATUS.PairedConnecting
              }
              error={!spi.configuration.isValid}
              fullWidth
              helperText={!spi.configuration.isValid ? TEXT_FORM_VALIDATION_EFTPOS_ADDRESS_TEXTFIELD : ''}
              InputProps={{
                endAdornment: <ErrorInputAdornment isValid={!spi.configuration.isValid} />,
              }}
              label="EFTPOS address"
              margin="dense"
              onBlur={(event: IFormEventValue) =>
                handleDeviceAddressOnBlur(dispatch, event, eftposAddressValidator, spi, updatePairFormParams)
              }
              onChange={(event: IFormEventValue) =>
                handleDeviceAddressOnChange(setSpi, 'configuration', () =>
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
            dataTestId="serialNumberField"
            disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
            error={!spi.serialNumber.isValid}
            fullWidth
            helperText={!spi.serialNumber.isValid ? TEXT_FORM_VALIDATION_SERIAL_NUMBER_TEXTFIELD : ''}
            InputProps={{
              endAdornment: <ErrorInputAdornment isValid={!spi.serialNumber.isValid} />,
            }}
            label="Serial number"
            margin="dense"
            onBlur={(event: IFormEventValue) =>
              handleSerialNumberOnBlur(dispatch, event, serialNumberValidator, setSpi, updatePairFormParams)
            }
            onChange={(event: IFormEventValue) => handleSerialNumberChange(setSpi, 'serialNumber')(event)}
            required
            value={spi.serialNumber.value}
            variant="outlined"
          />
        </Grid>
        <Grid item className={classes.fieldSpace}>
          <CustomTextField
            dataTestId="posIdField"
            disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
            error={!spi.posId.isValid}
            fullWidth
            helperText={!spi.posId.isValid ? TEXT_FORM_VALIDATION_POS_ID_TEXTFIELD : ''}
            InputProps={{
              endAdornment: <ErrorInputAdornment isValid={!spi.posId.isValid} />,
            }}
            label="POS ID"
            margin="dense"
            onBlur={(event: IFormEventValue) =>
              handlerPosIdOnBlur(dispatch, event, fieldRequiredValidator, setSpi, updatePairFormParams)
            }
            onChange={(event: IFormEventValue) => handlePosIdChange(setSpi, 'posId')(event)}
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
                data-test-id="testModeCheckbox"
                name="testMode"
                onChange={(event: IFormEventCheckbox) =>
                  handleTestModeOnChange(dispatch, event, setSpi, updatePairFormParams)
                }
              />
            }
            label="Test mode"
          />
        </Grid>
      </Grid>
    </>
  );
}
