import React from 'react';
import Box from '@material-ui/core/Box';
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
  TEXT_FORM_VALIDATION_API_KEY_TEXTFIELD,
  TEXT_FORM_VALIDATION_POS_ID_TEXTFIELD,
  TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD,
  TEXT_FORM_VALIDATION_SERIAL_NUMBER_TEXTFIELD,
  SPI_PAIR_FLOW,
} from '../../../definitions/constants/commonConfigs';
import { useAppSelector } from '../../../redux/hooks';
import {
  handleApikeyBlur,
  handleApikeyChange,
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
  initialSpi,
} from '../../../utils/common/pair/pairFormHelpers';
import useLocalStorage from '../../../utils/hooks/useLocalStorage';
import {
  fieldRequiredValidator,
  serialNumberValidator,
  saveButtonValidator,
} from '../../../utils/validators/pairFormValidators';
import CustomTextField from '../../CustomTextField';
import ErrorInputAdornment from '../../CustomTextField/ErrorInputAdornment';
import useStyles from './index.styles';
import { IFormEventValue, IPreventDefault, ISPIData } from './interfaces';
import SPIModal from './SPIModal';

const PairForm: React.FC = () => {
  const classes = useStyles();
  // spi state
  const [spi, setSpi] = useLocalStorage<ISPIData>('spi', initialSpi);
  // save settings logics
  const handleSubmit = (event: IPreventDefault) => {
    event.preventDefault();
  };
  // read pair states
  const pair = useAppSelector((state) => state.pair);

  return (
    <Grid container direction="column" className={classes.formContainer}>
      <form autoComplete="off" onSubmit={handleSubmit} className={classes.pairForm}>
        <Grid item className={classes.mainTitle}>
          <Typography variant="h6" component="h1">
            Configuration
          </Typography>
        </Grid>
        <Grid container direction="column">
          <Grid container direction="row" className={classes.fieldSpace}>
            <Grid item xs={10} className={classes.columnSpace}>
              <CustomTextField
                className={classes.paymentProvider}
                disabled={pair.status === SPI_PAIR_FLOW.PAIRING}
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
                onBlur={(event: IFormEventValue) =>
                  handleProviderBlur(setSpi, 'provider', fieldRequiredValidator)(event)
                }
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
                disabled={pair.status === SPI_PAIR_FLOW.PAIRING}
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
                  disabled={pair.status === SPI_PAIR_FLOW.PAIRING}
                  id="configurationField"
                  label="Configuration option"
                  labelId="configurationDropdownLabel"
                  onBlur={(event: IFormEventValue) => handleConfigTypeBlur(setSpi, 'testMode')(event)}
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
                  pair.status === SPI_PAIR_FLOW.PAIRING
                }
                fullWidth
                id="eftposAddressField"
                label="EFTPOS address"
                margin="dense"
                onChange={(event: IFormEventValue) => handleConfigAddressChange(setSpi, 'configuration')(event)}
                value={spi.configuration.value}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid item className={classes.fieldSpace}>
            <CustomTextField
              disabled={pair.status === SPI_PAIR_FLOW.PAIRING}
              error={!spi.serialNumber.isValid}
              fullWidth
              helperText={!spi.serialNumber.isValid ? TEXT_FORM_VALIDATION_SERIAL_NUMBER_TEXTFIELD : ''}
              id="serialNumberField"
              InputProps={{
                endAdornment: <ErrorInputAdornment isValid={!spi.serialNumber.isValid} />,
              }}
              label="Serial number"
              margin="dense"
              onBlur={(event: IFormEventValue) =>
                handleSerialNumberBlur(setSpi, 'serialNumber', serialNumberValidator)(event)
              }
              onChange={(event: IFormEventValue) => handleSerialNumberChange(setSpi, 'serialNumber')(event)}
              required
              value={spi.serialNumber.value}
              variant="outlined"
            />
          </Grid>
          <Grid item className={classes.fieldSpace}>
            <CustomTextField
              disabled={pair.status === SPI_PAIR_FLOW.PAIRING}
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
              onBlur={(event: IFormEventValue) => handlePosIdBlur(setSpi, 'posId', fieldRequiredValidator)(event)}
              required
              value={spi.posId.value}
              variant="outlined"
            />
          </Grid>
          <Grid item className={classes.fieldSpace}>
            <CustomTextField
              disabled={pair.status === SPI_PAIR_FLOW.PAIRING}
              error={!spi.apikey.isValid}
              fullWidth
              helperText={!spi.apikey.isValid ? TEXT_FORM_VALIDATION_API_KEY_TEXTFIELD : ''}
              id="apiKeyField"
              InputProps={{
                endAdornment: <ErrorInputAdornment isValid={!spi.apikey.isValid} />,
              }}
              label="API Key"
              margin="dense"
              onChange={(event: IFormEventValue) => handleApikeyChange(setSpi, 'apikey')(event)}
              onBlur={(event: IFormEventValue) => handleApikeyBlur(setSpi, 'apikey', fieldRequiredValidator)(event)}
              required
              value={spi.apikey.value}
              variant="outlined"
            />
          </Grid>
          <Grid item className={classes.fieldSpace}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={spi.testMode}
                  color="primary"
                  disabled={pair.status === SPI_PAIR_FLOW.PAIRING}
                  id="testModeCheckbox"
                  name="testMode"
                  onChange={(event: IFormEventValue) => handleTestModeChange(setSpi, 'testMode')(event)}
                />
              }
              label="Test mode"
            />
          </Grid>
          <Grid item>
            <Box marginTop={1.5} display="flex" justifyContent="flex-end">
              <Button
                color="primary"
                className={classes.saveBtn}
                disabled={!saveButtonValidator(spi) || pair.status === SPI_PAIR_FLOW.PAIRING}
                id="saveSettingsButton"
                type="submit"
                variant="contained"
              >
                Save settings
              </Button>
            </Box>
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
