import React, { useEffect, useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { Spi as SpiClient } from '@mx51/spi-client-js';

import {
  SPI_PAIR_STATUS,
  TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  TEXT_FORM_DEFAULT_OPTION,
  TEXT_FORM_DEFAULT_VALUE,
  TEXT_FORM_VALIDATION_EFTPOS_ADDRESS_TEXTFIELD,
  TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD,
} from '../../../../definitions/constants/commonConfigs';
import { defaultApikey, defaultPosName } from '../../../../definitions/constants/spiConfigs';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  pairForm,
  selectPairFormDeviceAddress,
  selectPairFormSerialNumber,
} from '../../../../redux/reducers/PairFormSlice/PairFormSelectors';
import { updatePairFormParams } from '../../../../redux/reducers/PairFormSlice/pairFormSlice';
import { terminalInstance, terminalList } from '../../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
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
  isHttps,
} from '../../../../utils/common/pair/pairFormHelpers';
import {
  eftposAddressValidator,
  fieldRequiredValidator,
  paymentProviderValidator,
  postIdValidator,
  serialNumberValidatorOnBlur,
  serialNumberValidatorOnChange,
} from '../../../../utils/validators/validators';
import CustomTextField from '../../../CustomTextField';
import ErrorInputAdornment from '../../../CustomTextField/ErrorInputAdornment';
import useStyles from '../index.styles';
import { IFormEventCheckbox, IFormEventValue } from '../interfaces';

export default function PairConfiguration(): React.ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  // read redux store states
  const { acquirerCode, addressType, deviceAddress, posId, serialNumber, testMode } = useAppSelector(pairForm);
  const pairFormDeviceAddress = useAppSelector(selectPairFormDeviceAddress);
  const pairFormSerialNumber = useAppSelector(selectPairFormSerialNumber);
  const terminal = useAppSelector(terminalInstance(pairFormSerialNumber));
  const terminals = useAppSelector(terminalList);
  const [tenantList, setTenantList] = useState<TenantList>([]);

  useEffect(() => {
    SpiClient.GetAvailableTenants(posId ?? defaultPosName, defaultApikey, 'AU').then((response: TenantListResponse) => {
      setTenantList(response.Data);
    });
  }, []);

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
                <MenuItem value={TEXT_FORM_DEFAULT_OPTION} disabled>
                  Payment provider
                </MenuItem>
                {tenantList.map((tenant: Tenant) => (
                  <MenuItem key={tenant.code} value={tenant.code}>
                    {tenant.name}
                  </MenuItem>
                ))}
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
                handlePaymentProviderFieldOnBlur(dispatch, event, paymentProviderValidator, updatePairFormParams)
              }
              onChange={(event: IFormEventValue) =>
                handlePaymentProviderFieldOnChange(dispatch, event, paymentProviderValidator, updatePairFormParams)
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
                <MenuItem value={TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE} disabled={!isHttps()}>
                  Auto address
                </MenuItem>
                <MenuItem value={TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE} disabled={isHttps()}>
                  EFTPOS address
                </MenuItem>
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
              value={pairFormDeviceAddress}
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
            helperText={
              !serialNumber.isValid
                ? serialNumberValidatorOnChange(serialNumber.value) || serialNumberValidatorOnBlur(serialNumber.value)
                : ''
            }
            InputProps={{
              endAdornment: <ErrorInputAdornment isValid={!serialNumber.isValid} />,
            }}
            label="Serial number"
            margin="dense"
            onBlur={(event: IFormEventValue) =>
              handleSerialNumberFieldOnBlur(dispatch, event, serialNumberValidatorOnBlur, updatePairFormParams)
            }
            onChange={(event: IFormEventValue) =>
              handleSerialNumberFieldOnChange(dispatch, event, serialNumberValidatorOnChange, updatePairFormParams)
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
            helperText={!posId.isValid ? postIdValidator(posId.value, terminals) : ''}
            InputProps={{
              endAdornment: <ErrorInputAdornment isValid={!posId.isValid} />,
            }}
            label="POS ID"
            margin="dense"
            onBlur={(event: IFormEventValue) =>
              handlePosIdFieldOnBlur(dispatch, event, postIdValidator, terminals, updatePairFormParams)
            }
            onChange={(event: IFormEventValue) =>
              handlePosIdFieldOnChange(dispatch, event, postIdValidator, terminals, updatePairFormParams)
            }
            required
            value={posId.value}
            variant="outlined"
          />
        </Grid>
        <Grid item className={classes.fieldSpace}>
          <FormControlLabel
            control={
              <Checkbox
                checked={testMode && acquirerCode.value.toLowerCase() !== 'gko'}
                color="primary"
                disabled={
                  terminal?.status === SPI_PAIR_STATUS.PairedConnecting || acquirerCode.value.toLowerCase() === 'gko'
                }
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
