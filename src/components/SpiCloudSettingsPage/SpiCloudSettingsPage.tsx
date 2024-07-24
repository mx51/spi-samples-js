import React, { useEffect, useState } from 'react';

import { Button, Container, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from '../Layout';
import useStyles from './index.styles';
import { PATH_SPI_CLOUD_PAIRING } from '../../definitions/constants/routerConfigs';
import CustomTextField from '../CustomTextField';
import { IFormEventValue } from '../PairPage/PairForm/interfaces';
import { setDevSettings } from '../../redux/reducers/SpiCloudSettingsSlice/spiCloudSettingsSlice';
import { useAppSelector } from '../../redux/hooks';
import { selectSpiCloudSettingsDev } from '../../redux/reducers/SpiCloudSettingsSlice/spiCloudSettingsSelectors';

const SpiCloudSettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const devSettings = useAppSelector(selectSpiCloudSettingsDev);
  const [apiKey, setApiKey] = useState('');
  const [secretPartA, setSecretPartA] = useState('');
  const goToSpiCloudPairing = () => {
    history.push(PATH_SPI_CLOUD_PAIRING);
  };

  useEffect(() => {
    if (devSettings) {
      setApiKey(devSettings.apiKey);
      setSecretPartA(devSettings.secretPartA);
    }
  }, [devSettings]);

  const handleSettingsUpdate = () => {
    if (!apiKey && !setSecretPartA) {
      return;
    }
    dispatch(
      setDevSettings({
        apiKey,
        secretPartA,
      })
    );
    goToSpiCloudPairing();
  };

  return (
    <Layout>
      <Container maxWidth="md" className={classes.root}>
        <Button className={classes.backLink} onClick={() => goToSpiCloudPairing()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#393F73" />
          </svg>
          <span className={classes.backLinkText}>Back to SPI Cloud Pairing</span>
        </Button>
        <>
          <Typography variant="h6" component="h1" className={classes.defaultMargin}>
            SPI Cloud Settings (DEV Environment)
          </Typography>
          <p className={classes.defaultMargin}>Add your APIKey and Secret Part A, retrieved from the POS Dashboard</p>
          <CustomTextField
            className={classes.defaultMargin}
            dataTestId="spiCloudApiKey"
            fullWidth
            label="API Key"
            margin="dense"
            onChange={(event: IFormEventValue) => setApiKey(String(event.target.value))}
            required
            value={apiKey}
            variant="outlined"
          />

          <CustomTextField
            className={classes.defaultMargin}
            dataTestId="spiCloudApiKey"
            fullWidth
            label="secretPartA"
            margin="dense"
            onChange={(event: IFormEventValue) => setSecretPartA(String(event.target.value))}
            required
            value={secretPartA}
            variant="outlined"
          />

          <Button color="primary" data-test-id="pairBtn" onClick={() => handleSettingsUpdate()} variant="contained">
            Update
          </Button>
        </>
      </Container>
    </Layout>
  );
};

export default SpiCloudSettingsPage;
