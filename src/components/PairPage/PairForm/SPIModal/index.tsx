import React, { useCallback, useState } from 'react';
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
import {
  TEXT_FORM_DEFAULT_VALUE,
  TEXT_FORM_MODAL_CODE_TILL,
  TEXT_FORM_MODAL_CODE_WESTPAC,
} from '../../../../definitions/constants/commonConfigs';
import { useAppDispatch } from '../../../../redux/hooks';
import { updatePairFormParams } from '../../../../redux/reducers/PairFormSlice/pairFormSlice';
import { ISPIModel } from '../interfaces';
import useStyles from './index.styles';

function SPIModal({ modalToggle, handleProviderChange, onClose, providerValue }: ISPIModel): React.ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [selectedProvider, setProvider] = useState(providerValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProvider((event.target as HTMLInputElement).value);
  };

  const handleClose = () => {
    setProvider(providerValue); // keep as previous selection
    onClose(providerValue);
  };

  const handleOk = useCallback(() => {
    dispatch(
      updatePairFormParams({
        key: 'acquirerCode',
        value: {
          value: selectedProvider,
          isValid: true,
        },
      })
    );
    handleProviderChange(selectedProvider); // update to latest selection;
    onClose(selectedProvider);
  }, [selectedProvider]);

  const readOtherTypeValue = (value: string): string => {
    if (
      value === TEXT_FORM_MODAL_CODE_TILL ||
      value === TEXT_FORM_MODAL_CODE_WESTPAC ||
      value === TEXT_FORM_DEFAULT_VALUE
    )
      return '';

    return value;
  };

  return (
    <Dialog aria-labelledby="spiModalTitle" open={modalToggle}>
      <DialogTitle id="spiModalTitle" className={classes.spiModalHeading}>
        Simple Payments Integration
      </DialogTitle>
      <Typography variant="body2" className={classes.spiModalSubHeading}>
        Select Your Payment Provider
      </Typography>
      <DialogContent dividers>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="paymentProviderSelector"
            data-test-id="paymentProviderSelector"
            name="paymentProviderSelector"
            value={selectedProvider}
            onChange={handleChange}
          >
            <FormControlLabel
              control={<Radio color="primary" />}
              data-test-id="till"
              label="Till Payments"
              value={TEXT_FORM_MODAL_CODE_TILL}
            />
            <FormControlLabel
              control={<Radio color="primary" />}
              data-test-id="wbc"
              label="Westpac"
              value={TEXT_FORM_MODAL_CODE_WESTPAC}
            />
            <FormControlLabel
              control={<Radio color="primary" />}
              data-test-id="other"
              label="Other (type in field)"
              value={readOtherTypeValue(providerValue)}
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="primary" id="spiCloseBtn" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="primary" id="spiOkBtn" onClick={handleOk}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SPIModal;
