import React from 'react';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import { SPI_PAIR_STATUS } from '../../../../definitions/constants/commonConfigs';
import { ReactComponent as FYROIcon } from '../../../../images/SP_logo_fyro.svg';
import { ReactComponent as LinkLinkIcon } from '../../../../images/SP_logo_linklink.svg';
import { ReactComponent as SPIIcon } from '../../../../images/SP_logo_SPI.svg';
import { ReactComponent as ZNVIcon } from '../../../../images/SP_logo_ZNV.svg';
import useStyles from '../index.styles';
import { IPaymentType } from '../interfaces';

export default function PaymentType({ terminal }: IPaymentType): React.ReactElement {
  const classes = useStyles();

  return (
    <>
      <Grid item className={classes.title}>
        <Typography variant="h6" component="h1">
          Payment type
        </Typography>
      </Grid>
      <Grid container direction="column">
        <Grid container direction="row" className={classes.fieldSpace}>
          <FormControl className={classes.paymentTypeWrapper} component="fieldset" fullWidth>
            <RadioGroup aria-label="paymentType" name="paymentType" value="spi">
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
                value="spi"
              />
              <FormControlLabel
                className={classes.paymentTypeRadioButton}
                control={<Radio color="primary" />}
                disabled
                label={
                  <Box display="flex" alignItems="center">
                    <LinkLinkIcon className={classes.paymentTypeRadioButtonIcon} />
                    <span>Cloud Connect</span>
                  </Box>
                }
                value="link"
              />
              <FormControlLabel
                className={classes.paymentTypeRadioButton}
                control={<Radio color="primary" />}
                disabled
                label={
                  <Box display="flex" alignItems="center">
                    <ZNVIcon className={classes.paymentTypeRadioButtonIcon} />
                    <span>ZNV PayFast</span>
                  </Box>
                }
                value="znv"
              />
              <FormControlLabel
                className={classes.paymentTypeRadioButton}
                control={<Radio color="primary" />}
                disabled
                label={
                  <Box display="flex" alignItems="center">
                    <FYROIcon className={classes.paymentTypeRadioButtonIcon} />
                    <span>Fyro Payments</span>
                  </Box>
                }
                value="fyro"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
}
