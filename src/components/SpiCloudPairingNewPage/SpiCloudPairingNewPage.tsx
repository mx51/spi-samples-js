import React from 'react';

import { Button, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import Layout from '../Layout';
import useStyles from './index.styles';
import { PATH_SPI_CLOUD_PAIRING } from '../../definitions/constants/routerConfigs';
import CustomTextField from '../CustomTextField';
import { IFormEventValue } from '../PairPage/PairForm/interfaces';
import { addPairing } from '../../redux/reducers/PairingSlice/pairingSlice';
import { useAppSelector } from '../../redux/hooks';
import { selectSpiCloudSettingsDev } from '../../redux/reducers/SpiCloudSettingsSlice/spiCloudSettingsSelectors';

interface PairingResponse {
  data: {
    confirmation_code: string;
    key_id: string;
    pairing_id: string;
    signing_secret_part_b: string;
    spi_cloud_api_base_url: string;
  };
}

const SpiCloudPairingNewPage: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const [spiPairCode, setSpiPairCode] = React.useState<string>('');
  const [pairSuccess, setPairSuccess] = React.useState<boolean>(false);
  const [pairingResponse, setPairingResponse] = React.useState<PairingResponse>();
  const devSettings = useAppSelector(selectSpiCloudSettingsDev);

  const goToSpiCloudPairing = () => {
    history.push(PATH_SPI_CLOUD_PAIRING);
  };

  const onCancel = () => {
    console.log('onCancel');
    setSpiPairCode('');
    setPairingResponse(undefined);
    setPairSuccess(false);
  };

  const handlePairing = async () => {
    try {
      const response = await fetch(devSettings.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `ApiKey ${devSettings.apiKey}`,
        },
        body: JSON.stringify({
          pairing_code: spiPairCode,
        }),
      });
      if (!response.ok) {
        alert(`Response status: ${response.status}`);
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      setPairSuccess(true);
      setPairingResponse(result);
    } catch (error) {
      alert(`Error pairing - ${error}`);
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
        id: pairing_id,
        pairingConfig: {
          pairing_id,
          signing_secret_part_b,
          spi_cloud_api_base_url,
        },
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
        {pairSuccess ? (
          <div aria-live="polite">
            <Typography variant="h6" component="h1" className={classes.defaultMargin}>
              Confirm Pairing
            </Typography>
            <p
              className={classes.defaultMargin}
            >{`Please confirm that this code is showing on your payment terminal before you start using the integration `}</p>
            <Typography className={classes.defaultMargin} variant="body1">
              Confirmation Code: <strong>{pairingResponse?.data.confirmation_code}</strong>
            </Typography>
            <Button color="primary" data-test-id="pairBtn" onClick={() => handleConfirmation()} variant="contained">
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
          </div>
        ) : (
          <>
            <Typography variant="h6" component="h1" className={classes.defaultMargin}>
              New SPI Cloud Pairing
            </Typography>
            <p className={classes.defaultMargin}>
              {`You can find the SPI Cloud Pairing Code on your Payment Terminal by selecting "Manage POS Pairing" > "New
          SPI Cloud Pairing`}
            </p>
            <CustomTextField
              className={classes.defaultMargin}
              dataTestId="spiCloudPairingCode"
              fullWidth
              label="Spi Cloud Pairing Code"
              margin="dense"
              onChange={(event: IFormEventValue) => setSpiPairCode(String(event.target.value))}
              required
              value={spiPairCode}
              variant="outlined"
            />

            <p className={classes.defaultMargin}>
              {`Remember to click 'start' on your terminal before clicking pair below.`}
            </p>

            <Button color="primary" data-test-id="pairBtn" onClick={() => handlePairing()} variant="contained">
              Pair
            </Button>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default SpiCloudPairingNewPage;
