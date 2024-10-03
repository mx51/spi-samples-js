import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Prompt, useLocation } from 'react-router-dom';
import { Action, Location } from 'history';
import useStyles from './index.styles';
import { IFormEventValue } from '../PairPage/PairForm/interfaces';
import { useAppSelector } from '../../redux/hooks';
import { selectSpiCloudSettings } from '../../redux/reducers/SpiCloudSettingsSlice/spiCloudSettingsSelectors';
import { setPairingSettings } from '../../redux/reducers/SpiCloudSettingsSlice/spiCloudSettingsSlice';
import CustomTextField from '../CustomTextField';
import { ISpiCloudSettingsProps, SpiCloudEnvironment } from '../../redux/reducers/SpiCloudSettingsSlice/interfaces';
import { currentEnvSelector } from '../../redux/reducers/CurrentEnvSlice/currentEnvSelector';

export const IntegrationsSettingsPanel: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryParamEnv = (queryParams.get('env') as SpiCloudEnvironment) || 'live';
  const pairingSettings = useAppSelector(selectSpiCloudSettings);
  const [settings, setSettings] = useState<ISpiCloudSettingsProps>(pairingSettings);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const currentEnv = useAppSelector(currentEnvSelector);
  const [env, setEnv] = useState<SpiCloudEnvironment>(currentEnv === 'LIVE' ? 'live' : queryParamEnv);
  const dispatchUpdate = () => {
    dispatch(setPairingSettings(settings));
    setShowSnackbar(true);
  };

  const handleSettingsUpdate = (environment: SpiCloudEnvironment, key: string, value: string) => {
    setIsBlocking(true);
    setSettings((prevState) => ({
      ...prevState,
      [environment]: {
        ...prevState[environment],
        [key]: value,
      },
    }));
  };

  const handleBlockedNavigation = () => `You have unsaved changes. Are you sure you want to go to leave this page?`;

  /**
   Handle blocking page refresh if unsaved changes
   */
  useEffect(() => {
    if (isBlocking) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = () => undefined;
    }
  }, [isBlocking]);

  const envs: SpiCloudEnvironment[] = currentEnv === 'DEV' ? ['dev', 'qa', 'live', 'other'] : ['live'];

  return (
    <>
      <Box className={classes.toolContainer} key="integration">
        <Box className={classes.spiCloudSettingHeader}>
          <Typography component="h1" className={classes.h1}>
            SPI Cloud
          </Typography>
          <Button color="primary" data-test-id="pairBtn" onClick={() => dispatchUpdate()} variant="contained">
            Save
          </Button>
        </Box>
        <Box marginBottom={2}>
          <Typography>Configure SPI Cloud Settings</Typography>
        </Box>
        {currentEnv === 'DEV' && (
          <Box marginBottom={2}>
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
          </Box>
        )}

        {envs.map(
          (environment) =>
            environment === env && (
              <Box key={environment} className={classes.envSettingsContainer}>
                <Typography variant="h6" gutterBottom>
                  {environment.toUpperCase()}
                </Typography>
                <CustomTextField
                  dataTestId="spiCloudApiKey"
                  fullWidth
                  label="Pairing API Key"
                  margin="dense"
                  onChange={(event: IFormEventValue) =>
                    handleSettingsUpdate(environment, 'apiKey', String(event.target.value))
                  }
                  required
                  value={settings[environment].apiKey}
                  variant="outlined"
                />

                <CustomTextField
                  dataTestId="spiCloudApiKey"
                  fullWidth
                  label="Signing secret part A"
                  margin="dense"
                  onChange={(event: IFormEventValue) =>
                    handleSettingsUpdate(environment, 'secretPartA', String(event.target.value))
                  }
                  required
                  value={settings[environment].secretPartA}
                  variant="outlined"
                />

                {environment === 'other' && (
                  <CustomTextField
                    dataTestId="url"
                    fullWidth
                    label="URL"
                    margin="dense"
                    onChange={(event: IFormEventValue) =>
                      handleSettingsUpdate(environment, 'apiBaseUrl', String(event.target.value))
                    }
                    required
                    value={settings[environment].apiBaseUrl}
                    variant="outlined"
                  />
                )}
              </Box>
            )
        )}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={10000}
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert variant="filled" severity="success">
          SPI Cloud Settings updated
        </Alert>
      </Snackbar>
      {/** Prompt to confirm navigation when there are unsaved changes  */}
      <Prompt when={isBlocking} message={handleBlockedNavigation} />
    </>
  );
};
