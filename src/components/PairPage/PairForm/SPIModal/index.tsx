import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
// constants
import {
  TEXT_FORM_MODAL_CODE_TILL,
  TEXT_FORM_MODAL_CODE_WESTPAC,
} from '../../../../definitions/constants/commonConfigs';
// styles
import useStyles from './index.styles';
// interfaces
import { ISPIModel } from '../interfaces';

function SPIModal({ modalToggle, handleProviderChange, onClose, providerValue }: ISPIModel): React.ReactElement {
  const classes = useStyles();
  const [selectedProvider, setProvider] = useState(providerValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProvider((event.target as HTMLInputElement).value);
  };
  const handleClose = () => {
    setProvider(providerValue); // keep previous selection
    onClose(providerValue);
  };
  const handleOk = () => {
    handleProviderChange(selectedProvider); // update selection;
    onClose(selectedProvider);
  };

  return (
    <Dialog aria-labelledby="spiModalTitle" open={modalToggle}>
      <DialogTitle id="spiModalTitle" className={classes.spiModalHeading}>
        Simple Payments Integration
      </DialogTitle>
      <Typography variant="body2" className={classes.spiModalSubHeading}>
        Select your Payment provider
      </Typography>
      <DialogContent dividers>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="paymentProviderSelector"
            name="paymentProviderSelector"
            value={selectedProvider}
            onChange={handleChange}
          >
            <FormControlLabel
              value={TEXT_FORM_MODAL_CODE_TILL}
              control={<Radio color="primary" />}
              label="Till Payments"
            />
            <FormControlLabel
              value={TEXT_FORM_MODAL_CODE_WESTPAC}
              control={<Radio color="primary" />}
              label="Westpac"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleOk}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SPIModal;
