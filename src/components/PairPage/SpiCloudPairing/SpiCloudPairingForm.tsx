import React, { useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from 'react-router-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import useStyles from './index.styles';
import { IFormEventValue } from '../PairForm/interfaces';
import { SpiCloudEnvironment } from '../../../redux/reducers/SpiCloudSettingsSlice/interfaces';
import CustomTextField from '../../CustomTextField';
import { useAppSelector } from '../../../redux/hooks';
import { currentEnvSelector } from '../../../redux/reducers/CurrentEnvSlice/currentEnvSelector';
import { selectSpiCloudSettingsHasValues } from '../../../redux/reducers/SpiCloudSettingsSlice/spiCloudSettingsSelectors';
import { PATH_SETTINGS } from '../../../definitions/constants/routerConfigs';
import { ReactComponent as ForwardArrowIcon } from '../../../images/ForwardArrowIcon.svg';

type Inputs = {
  pairingCode: string;
  posNickname: string;
};

type Props = {
  onSubmit: (env: SpiCloudEnvironment, data: Inputs) => void;
};

export const SpiCloudPairingForm: React.FC<Props> = ({ onSubmit }) => {
  const classes = useStyles();
  const history = useHistory();
  const currentEnv = useAppSelector(currentEnvSelector);
  const [env, setEnv] = useState<SpiCloudEnvironment>('live');
  const envHasValues = useAppSelector((rootState) => selectSpiCloudSettingsHasValues(env)(rootState));
  const {
    control,
    handleSubmit: useFormSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const goToSettings = () => {
    history.push(`${PATH_SETTINGS}/integration-settings?env=${env}`);
  };

  const handleSubmit: SubmitHandler<Inputs> = async (data) => {
    onSubmit(env, data);
  };

  return (
    <>
      <Typography variant="h6" component="h1">
        Pairing configuration
      </Typography>
      {/** Only show the env selector in the DEV environment, in prod we just show live */}
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
      {/** If configuration has been set for the environment under integration settings, we show the form,
       otherwise a link to settings to update config */}
      {envHasValues && (
        <>
          <form onSubmit={useFormSubmit(handleSubmit)}>
            <Controller
              name="pairingCode"
              control={control}
              rules={{ required: 'Pairing code is required' }}
              defaultValue=""
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <CustomTextField
                  fullWidth
                  onChange={onChange}
                  onBlur={onBlur}
                  error={Boolean(errors.pairingCode)}
                  value={value}
                  ref={ref}
                  label="Spi Cloud Pairing Code"
                  margin="dense"
                  helperText={
                    errors.pairingCode?.message || 'You can get the pairing code from the terminals pairing setup'
                  }
                  variant="outlined"
                />
              )}
            />
            <Controller
              name="posNickname"
              control={control}
              defaultValue=""
              rules={{ required: 'POS Nickname is required' }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <CustomTextField
                  fullWidth
                  error={Boolean(errors.posNickname)}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  ref={ref}
                  label="POS nickname"
                  margin="dense"
                  helperText={errors.posNickname?.message}
                  variant="outlined"
                />
              )}
            />
            <Box mt={2}>
              <Button color="primary" data-test-id="pairBtn" variant="contained" type="submit">
                Pair
              </Button>
            </Box>
          </form>
        </>
      )}
      {!envHasValues && (
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
  );
};
