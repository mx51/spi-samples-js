import React, { useReducer } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SpiCloudPairingConfirmation } from './SpiCloudCodeConfirmation';
import { SpiCloudPairingForm } from './SpiCloudPairingForm';
import { initialState, reducer } from './SpiCloudPairingReducer';
import { useAppSelector } from '../../../redux/hooks';
import { selectSpiCloudSettings } from '../../../redux/reducers/SpiCloudSettingsSlice/spiCloudSettingsSelectors';
import { SpiCloudEnvironment } from '../../../redux/reducers/SpiCloudSettingsSlice/interfaces';
import { addPairing } from '../../../redux/reducers/PairingSlice/pairingSlice';
import { PATH_SPI_CLOUD_PAIRING } from '../../../definitions/constants/routerConfigs';

export const SpiCloudPairing: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const spiCloudSettings = useAppSelector(selectSpiCloudSettings);
  const globalDispatch = useDispatch();
  const history = useHistory();

  const goToSpiCloudPairing = () => {
    history.push(PATH_SPI_CLOUD_PAIRING);
  };

  const onFormSubmit = async (env: SpiCloudEnvironment, data: { pairingCode: string; posNickname: string }) => {
    dispatch({ type: 'loading' });
    try {
      const response = await fetch(spiCloudSettings[env].apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `ApiKey ${spiCloudSettings[env].apiKey}`,
        },
        body: JSON.stringify({
          pairing_code: data.pairingCode,
        }),
      });
      if (!response.ok) {
        dispatch({ type: 'error' });
        return;
      }
      const result = await response.json();
      dispatch({ type: 'success', payload: { pairingResponse: result, posNickname: data.posNickname } });
    } catch (error) {
      dispatch({ type: 'error' });
      // eslint-disable-next-line no-console
      console.error('Error pairing', error);
    }
  };

  const onCancel = () => {
    dispatch({ type: 'initial' });
  };

  const onConfirmation = () => {
    if (!state.pairingResponse) {
      return;
    }
    const { pairing_id, signing_secret_part_b, spi_cloud_api_base_url } = state.pairingResponse.data;

    globalDispatch(
      addPairing({
        posNickname: state.posNickname,
        id: pairing_id,
        pairingConfig: {
          pairing_id,
          signing_secret_part_b,
          spi_cloud_api_base_url,
        },
      })
    );
    // TODO: [INTG-259] Replace this with a link to the regular terminals page
    goToSpiCloudPairing();
  };

  return (
    <>
      {state.isLoading && <CircularProgress />}
      {state.pairSuccess && (
        <SpiCloudPairingConfirmation
          pairingResponse={state.pairingResponse}
          onConfirmation={onConfirmation}
          onCancel={onCancel}
        />
      )}
      {!state.pairSuccess && !state.isLoading && <SpiCloudPairingForm onSubmit={onFormSubmit} />}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={10000}
        open={state.showErrorSnackbar}
        onClose={() => dispatch({ type: 'errorComplete' })}
      >
        <Alert variant="filled" severity="error">
          Pairing failed
        </Alert>
      </Snackbar>
    </>
  );
};
