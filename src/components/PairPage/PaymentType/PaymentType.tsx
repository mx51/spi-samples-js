import React, { ChangeEvent } from 'react';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';

import { ReactComponent as CloudIcon } from '../../../images/Cloud.svg';
import { ReactComponent as SPIIcon } from '../../../images/SP_logo_SPI.svg';

import useStyles from './index.styles';
import { useAppSelector } from '../../../redux/hooks';
import { selectPairFormSerialNumber } from '../../../redux/reducers/PairFormSlice/PairFormSelectors';
import { terminalInstance } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';

export enum PAYMENT_TYPE {
  SPI = 'spi',
  SPI_CLOUD = 'spiCloud',
}

type paymentTypeRadioProps = {
  handleChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
  value: PAYMENT_TYPE;
};

const PaymentTypeComponent: React.FC<paymentTypeRadioProps> = ({ handleChange, value }) => {
  const classes = useStyles();
  // read redux store states
  const pairFormSerialNumber = useAppSelector(selectPairFormSerialNumber);
  const terminal = useAppSelector(terminalInstance(pairFormSerialNumber));

  return (
    <>
      <Grid item className={classes.title}>
        <Typography variant="h6" component="h1">
          Integration type
        </Typography>
      </Grid>
      <Grid container direction="column">
        <Grid container direction="row" className={classes.fieldSpace}>
          <FormControl className={classes.paymentTypeWrapper} component="fieldset" fullWidth>
            <RadioGroup aria-label="paymentType" name="paymentType" value={value} onChange={handleChange}>
              <FormControlLabel
                className={classes.paymentTypeRadioButton}
                control={<Radio color="primary" />}
                disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
                label={
                  <Box display="flex" alignItems="center">
                    <SPIIcon className={classes.paymentTypeRadioButtonIcon} />
                    <span>Simple Payments Integration</span>
                  </Box>
                }
                value={PAYMENT_TYPE.SPI}
              />
              <FormControlLabel
                className={classes.paymentTypeRadioButton}
                control={<Radio color="primary" />}
                disabled={terminal?.status === SPI_PAIR_STATUS.PairedConnecting}
                label={
                  <Box display="flex" alignItems="center">
                    <CloudIcon className={classes.paymentTypeRadioButtonIcon} />
                    <span>SPI Cloud</span>
                  </Box>
                }
                value={PAYMENT_TYPE.SPI_CLOUD}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};

export default PaymentTypeComponent;
