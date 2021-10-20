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
import { pairForm, selectPairFormDeviceAddress } from '../../../../redux/reducers/PairFormSlice/PairFormSelectors';
import { updatePairFormParams } from '../../../../redux/reducers/PairFormSlice/pairFormSlice';
import {
  handlePaymentProviderFieldOnChange,
  handlePaymentProviderSelectorOnChange,
  handlePaymentProviderFieldOnBlur,
  handleTestModeCheckboxOnChange,
  handleAddressTypeSelectorOnBlur,
  handleAddressTypeSelectorOnChange,
  handleDeviceAddressFieldOnChange,
  handleDeviceAddressFieldOnBlur,
  handleSerialNumberFieldOnBlur,
  handleSerialNumberFieldOnChange,
  handlePosIdFieldOnBlur,
  handlePosIdFieldOnChange,
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

export default function PairConfiguration({ terminal }: IPairFormState): React.ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { acquirerCode, addressType, deviceAddress, posId, serialNumber, testMode } = useAppSelector(pairForm);
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
                data-test-id="paymentProviderSelectorLabel"
                disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
                label="Payment provider"
                labelId="paymentProviderSelectorLabel"
                onChange={(event: IFormEventValue) =>
                  handlePaymentProviderSelectorOnChange(dispatch, event, fieldRequiredValidator, updatePairFormParams)
                }
                value={acquirerCode.option}
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
                acquirerCode.option !== TEXT_FORM_DEFAULT_VALUE || terminal?.status === SPI_PAIR_STATUS.PairedConnecting
              }
              error={!acquirerCode.isValid}
              fullWidth
              helperText={!acquirerCode.isValid ? TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD : ''}
              InputProps={{
                endAdornment: <ErrorInputAdornment isValid={!acquirerCode.isValid} />,
              }}
              label={TEXT_FORM_DEFAULT_VALUE}
              margin="dense"
              onBlur={(event: IFormEventValue) =>
                handlePaymentProviderFieldOnBlur(dispatch, event, fieldRequiredValidator, updatePairFormParams)
              }
              onChange={(event: IFormEventValue) =>
                handlePaymentProviderFieldOnChange(dispatch, event, updatePairFormParams)
              }
              value={acquirerCode.value}
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
                onBlur={() => handleAddressTypeSelectorOnBlur(dispatch, testMode, updatePairFormParams)}
                onChange={(event: IFormEventValue) =>
                  handleAddressTypeSelectorOnChange(dispatch, event, updatePairFormParams)
                }
                value={addressType}
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
                addressType === TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE ||
                terminal?.status === SPI_PAIR_STATUS.PairedConnecting
              }
              error={!deviceAddress.isValid}
              fullWidth
              helperText={!deviceAddress.isValid ? TEXT_FORM_VALIDATION_EFTPOS_ADDRESS_TEXTFIELD : ''}
              InputProps={{
                endAdornment: <ErrorInputAdornment isValid={!deviceAddress.isValid} />,
              }}
              label="EFTPOS address"
              margin="dense"
              onBlur={(event: IFormEventValue) =>
                handleDeviceAddressFieldOnBlur(
                  addressType,
                  dispatch,
                  event,
                  eftposAddressValidator,
                  updatePairFormParams
                )
              }
              onChange={(event: IFormEventValue) =>
                handleDeviceAddressFieldOnChange(dispatch, event, updatePairFormParams)
              }
              value={
                (addressType === TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE &&
                  terminal?.status === SPI_PAIR_STATUS.PairedConnecting) ||
                terminal?.status === SPI_PAIR_STATUS.PairedConnected
                  ? pairFormDeviceAddress
                  : deviceAddress.value
              }
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid item className={classes.fieldSpace}>
          <CustomTextField
            dataTestId="serialNumberField"
            disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
            error={!serialNumber.isValid}
            fullWidth
            helperText={!serialNumber.isValid ? TEXT_FORM_VALIDATION_SERIAL_NUMBER_TEXTFIELD : ''}
            InputProps={{
              endAdornment: <ErrorInputAdornment isValid={!serialNumber.isValid} />,
            }}
            label="Serial number"
            margin="dense"
            onBlur={(event: IFormEventValue) =>
              handleSerialNumberFieldOnBlur(dispatch, event, serialNumberValidator, updatePairFormParams)
            }
            onChange={(event: IFormEventValue) =>
              handleSerialNumberFieldOnChange(dispatch, event, updatePairFormParams)
            }
            required
            value={serialNumber.value}
            variant="outlined"
          />
        </Grid>
        <Grid item className={classes.fieldSpace}>
          <CustomTextField
            dataTestId="posIdField"
            disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
            error={!posId.isValid}
            fullWidth
            helperText={!posId.isValid ? TEXT_FORM_VALIDATION_POS_ID_TEXTFIELD : ''}
            InputProps={{
              endAdornment: <ErrorInputAdornment isValid={!posId.isValid} />,
            }}
            label="POS ID"
            margin="dense"
            onBlur={(event: IFormEventValue) =>
              handlePosIdFieldOnBlur(dispatch, event, fieldRequiredValidator, updatePairFormParams)
            }
            onChange={(event: IFormEventValue) => handlePosIdFieldOnChange(dispatch, event, updatePairFormParams)}
            required
            value={posId.value}
            variant="outlined"
          />
        </Grid>
        <Grid item className={classes.fieldSpace}>
          <FormControlLabel
            control={
              <Checkbox
                checked={testMode}
                color="primary"
                disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
                data-test-id="testModeCheckbox"
                name="testMode"
                onChange={(event: IFormEventCheckbox) =>
                  handleTestModeCheckboxOnChange(dispatch, event, updatePairFormParams)
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
