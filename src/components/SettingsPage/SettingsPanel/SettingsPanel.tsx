import { Box, Divider, FormControl, Grid, Switch, TextField, Typography } from '@material-ui/core';
import React from 'react';
import useStyles from '../index.styles';
import { Props, ReceiptConfig, ReceiptConfigKey } from '../interfaces';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import spiService from '../../../services/spiService';
import { localStorageKeys } from '../../../utils/constants';

export const SettingsPanel: React.FC<Props> = ({ title, subtitle }) => {
  const classes = useStyles();

  const initialReceiptConfig: ReceiptConfig = {
    eftposMerchantCopy: false,
    eftposCustomerCopy: false,
    eftposSignatureFlow: false,
    suppressMerchantPassword: false,
    receiptHeader: '',
    receiptFooter: '',
  };

  const [receiptConfigData, setReceiptConfigData] = useLocalStorage(
    localStorageKeys.receiptConfig,
    initialReceiptConfig,
    (state) => spiService.updateReceiptConfig(state)
  );

  const receiptConfigMap: Record<string, ReceiptConfigKey> = {
    'Print Merchant Copy': 'eftposMerchantCopy',
    'Print Customer Copy': 'eftposCustomerCopy',
    'EFTPOS Signature Flow': 'eftposSignatureFlow',
    'Suppress Merchant Password': 'suppressMerchantPassword',
    'Receipt Header': 'receiptHeader',
    'Receipt Footer': 'receiptFooter',
  };

  const receiptConfigKeys = Object.keys(receiptConfigMap);

  const handleConfigChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value } = event.target as HTMLInputElement;
    if (['Receipt Header', 'Receipt Footer'].includes(name)) {
      const updatedConfig = {
        ...receiptConfigData,
        [receiptConfigMap[name]]: value,
      };
      setReceiptConfigData(updatedConfig);
    } else {
      setReceiptConfigData({
        ...receiptConfigData,
        [receiptConfigMap[name]]: checked,
      });
    }
  };

  return (
    <Box className={classes.toolContainer}>
      <Typography component="h1" className={classes.h1}>
        {title}
      </Typography>
      <Typography>{subtitle}</Typography>
      <Divider className={classes.divider} />
      <Grid container spacing={4}>
        {receiptConfigKeys.map((configOption) => (
          <Grid key={configOption} container alignItems="center">
            <Grid item xs={4}>
              <Typography className={classes.infoText}>{configOption}</Typography>
            </Grid>
            <Grid item xs={7}>
              <FormControl variant="outlined" margin="dense" fullWidth data-test-id="receiptConfigForm">
                {!['Receipt Header', 'Receipt Footer'].includes(configOption) ? (
                  <Switch
                    name={configOption}
                    checked={Boolean(receiptConfigData[receiptConfigMap[configOption]])}
                    onChange={handleConfigChange}
                  />
                ) : (
                  <TextField
                    name={configOption}
                    id="outlined-multiline-flexible"
                    label="Multiline"
                    multiline
                    maxRows={4}
                    fullWidth
                    placeholder="Enter custom receipt text"
                    onChange={handleConfigChange}
                    value={receiptConfigData[receiptConfigMap[configOption]]}
                  />
                )}
              </FormControl>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
