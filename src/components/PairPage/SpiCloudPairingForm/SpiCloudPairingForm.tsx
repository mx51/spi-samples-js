import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { PATH_SETTINGS, PATH_SPI_CLOUD_PAIRING } from '../../../definitions/constants/routerConfigs';
import useStyles from './index.styles';
import { useAppSelector } from '../../../redux/hooks';
import CustomTextField from '../../CustomTextField';
import { IFormEventValue } from '../PairForm/interfaces';
import {
  selectSpiCloudSettings,
  selectSpiCloudSettingsHasValues,
} from '../../../redux/reducers/SpiCloudSettingsSlice/spiCloudSettingsSelectors';
import { addPairing } from '../../../redux/reducers/PairingSlice/pairingSlice';
import { ReactComponent as ReconnectingIcon } from '../../../images/ReconnectingIcon.svg';
import { SpiCloudEnvironment } from '../../../redux/reducers/SpiCloudSettingsSlice/interfaces';
import { ReactComponent as ForwardArrowIcon } from '../../../images/ForwardArrowIcon.svg';
import { currentEnvSelector } from '../../../redux/reducers/CurrentEnvSlice/currentEnvSelector';

interface PairingResponse {
  data: {
    confirmation_code: string;
    key_id: string;
    pairing_id: string;
    signing_secret_part_b: string;
    spi_cloud_api_base_url: string;
  };
}

export const SpiCloudPairingForm: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const [spiPairCode, setSpiPairCode] = React.useState<string>('');
  const [pairSuccess, setPairSuccess] = React.useState<boolean>(false);
  const [pairingResponse, setPairingResponse] = React.useState<PairingResponse>();
  const spiCloudSettings = useAppSelector(selectSpiCloudSettings);
  const [env, setEnv] = useState<SpiCloudEnvironment>('live');
  const envHasValues = useAppSelector((state) => selectSpiCloudSettingsHasValues(env)(state));
  const [posNickname, setPosNickname] = useState<string>('');
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [errors, setErrors] = useState({ pairingCode: '', posNickname: '' });
  const [touched, setTouched] = useState({ pairingCode: false, posNickname: false });
  const currentEnv = useAppSelector(currentEnvSelector);

  const goToSpiCloudPairing = () => {
    history.push(PATH_SPI_CLOUD_PAIRING);
  };

  const onCancel = () => {
    setSpiPairCode('');
    setPairingResponse(undefined);
    setPairSuccess(false);
  };

  const goToSettings = () => {
    history.push(`${PATH_SETTINGS}/integration-settings?env=${env}`);
  };

  const validate = () => {
    const activeErrors = { pairingCode: '', posNickname: '' };

    activeErrors.pairingCode = spiPairCode === '' ? 'Pairing code is required' : '';
    activeErrors.posNickname = posNickname === '' ? 'POS nickname is required' : '';

    setErrors(activeErrors);
    return Object.values(activeErrors).every((x) => x === '');
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const handlePairing = async () => {
    setTouched({ pairingCode: true, posNickname: true });

    // Validate form
    if (!validate()) return;

    try {
      const response = await fetch(spiCloudSettings[env].apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `ApiKey ${spiCloudSettings[env].apiKey}`,
        },
        body: JSON.stringify({
          pairing_code: spiPairCode,
        }),
      });
      if (!response.ok) {
        setShowErrorSnackbar(true);
        return;
      }
      const result = await response.json();
      setPairSuccess(true);
      setShowSuccessSnackbar(true);
      setPairingResponse(result);
    } catch (error) {
      setShowErrorSnackbar(true);
      // eslint-disable-next-line no-console
      console.error('Error pairing', error);
    }
  };

  const handleConfirmation = () => {
    if (!pairingResponse) {
      return;
    }
    const { pairing_id, signing_secret_part_b, spi_cloud_api_base_url } = pairingResponse.data;

    dispatch(
      addPairing({
        posNickname,
        id: pairing_id,
        pairingConfig: {
          pairing_id,
          signing_secret_part_b,
          spi_cloud_api_base_url,
        },
      })
    );
    // TODO: [INTG-259] Replace this with a link to the regular pairing page
    goToSpiCloudPairing();
  };

  return (
    <>
      {pairSuccess ? (
        <div aria-live="polite">
          <Grid container direction="column" className={classes.statusPanel}>
            <Box display="flex" alignItems="center" className={classes.statusBox}>
              <ReconnectingIcon className={classes.reconnectIcon} />
              <Box ml={2}>
                <Typography variant="h6" component="h6">
                  Pairing
                </Typography>
                Confirm that the following Code is showing on the Terminal
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" marginLeft={2}>
              Code:
              <Typography variant="h5" className={classes.pairingCode}>
                {pairingResponse?.data?.confirmation_code}
              </Typography>
            </Box>
            <Grid container alignItems="center" justifyContent="flex-end">
              <Button color="primary" onClick={() => handleConfirmation()} variant="contained">
                Confirm
              </Button>
              <Button
                className={classes.cancelPairingBtn}
                data-test-id="cancelPairBtn"
                onClick={() => onCancel()}
                variant="outlined"
              >
                Cancel Pairing
              </Button>
            </Grid>
          </Grid>
        </div>
      ) : (
        <>
          <Typography variant="h6" component="h1">
            Pairing configuration
          </Typography>
          {currentEnv === 'DEV' && (
            <FormControl variant="outlined" margin="dense">
              <InputLabel>Environment</InputLabel>
              <Select
                label="Environment"
                value={env}
                onChange={(event: IFormEventValue) => setEnv(event.target.value as SpiCloudEnvironment)}
              >
                <MenuItem value="dev">DEV</MenuItem>
                <MenuItem value="qa">QA</MenuItem>
                <MenuItem value="live">LIVE</MenuItem>
                <MenuItem value="other">OTHER</MenuItem>
              </Select>
            </FormControl>
          )}
          {envHasValues ? (
            <>
              <CustomTextField
                fullWidth
                label="Spi Cloud Pairing Code"
                margin="dense"
                onChange={(event: IFormEventValue) => setSpiPairCode(String(event.target.value))}
                required
                onBlur={() => handleBlur('pairingCode')}
                value={spiPairCode}
                error={errors.pairingCode !== '' && touched.pairingCode}
                helperText={errors.pairingCode || 'You can get the pairing code from the terminals pairing setup'}
                variant="outlined"
              />
              <CustomTextField
                fullWidth
                label="POS nickname"
                margin="dense"
                onChange={(event: IFormEventValue) => setPosNickname(String(event.target.value))}
                required
                onBlur={() => handleBlur('posNickname')}
                error={errors.posNickname !== '' && touched.posNickname}
                helperText={errors.posNickname}
                value={posNickname}
                variant="outlined"
              />
              <Box mt={2}>
                <Button color="primary" data-test-id="pairBtn" onClick={() => handlePairing()} variant="contained">
                  Pair
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box mt={2} mb={2}>
                <Typography variant="body1">
                  Your integration settings have not been set up to pair with this environment.
                </Typography>
              </Box>
              <Button className={classes.backLink} onClick={() => goToSettings()}>
                <span className={classes.backLinkText}>Go to integration settings</span>
                <ForwardArrowIcon />
              </Button>
            </>
          )}
        </>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={10000}
        open={showErrorSnackbar}
        onClose={() => setShowErrorSnackbar(false)}
      >
        <Alert variant="filled" severity="error">
          Pairing failed
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={10000}
        open={showSuccessSnackbar}
        onClose={() => setShowSuccessSnackbar(false)}
      >
        <Alert variant="filled" severity="success">
          Pairing success
        </Alert>
      </Snackbar>
    </>
  );
};
