import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomTextField from '../../CustomTextField';
import useStyles from './index.styles';
import selectedTerminalIdSelector from '../../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import {
  isTerminalTxFlowSuccess,
  pairedConnectedTerminalList,
  terminalInstance,
  terminalTxFlowReceiptContent,
} from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import { updateSelectedTerminal } from '../../../redux/reducers/SelectedTerminalSlice/selectedTerminalSlice';
import spiService from '../../../services/spiService';

type Props = {
  setReceipt: React.Dispatch<React.SetStateAction<string>>;
};

export const GetTransactionPanel = ({ setReceipt }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [posRefId, setPosRefId] = useState<string>('');

  const terminals = useSelector(pairedConnectedTerminalList);
  const selectedTerminalId = useSelector(selectedTerminalIdSelector);
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;
  const isTxSuccess = useSelector(isTerminalTxFlowSuccess(selectedTerminal));
  const receiptContent = useSelector(terminalTxFlowReceiptContent(selectedTerminal));

  const onSubmitBtnClick = async () => {
    setReceipt('');
    console.log('onSubmitBtnClick');
    const getTransaction = await spiService.initiateGetTransaction(selectedTerminalId, posRefId);
    console.log('getTransaction =>', getTransaction);
    console.log(
      'receipt => ',
      currentTerminal?.txFlow?.isGetTx ? currentTerminal?.txFlow?.response?.data.merchantReceipt : null
    );
    if (isTxSuccess && currentTerminal?.txFlow?.isGetTx && receiptContent) {
      // setReceipt(currentTerminal?.txFlow?.response?.data.merchantReceipt);
      setReceipt(receiptContent);
    } else {
      setReceipt('');
    }
  };

  const onSelectTerminal = (terminalId: string) => {
    dispatch(updateSelectedTerminal(terminalId));
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <Typography component="h2" className={classes.h2}>
            Lookup
          </Typography>
        </Grid>

        <Grid item xs={7}>
          <CustomTextField
            dataTestId="autoAddressSerialNumberField"
            fullWidth
            label="pos_ref_id"
            margin="dense"
            // error={!serialNumber.isValid}
            helperText={currentTerminal?.receipt?.errorDetail}
            // onChange={onPosRefIdChange}
            onChange={(e) => setPosRefId(e.target.value as string)}
            // onBlur={(e) => setPosRefId(e.target.value as string)}
            required
            value={posRefId}
            variant="outlined"
          />

          <Typography className={classes.label}>Select terminal</Typography>
          <Divider />
          <RadioGroup className={classes.radioGroup} aria-label="terminalList" name="terminalList">
            <Box>
              <List>
                {terminals.map((terminal) => (
                  <ListItem key={terminal.id} dense disableGutters onClick={() => onSelectTerminal(terminal.id)}>
                    <ListItemIcon>
                      <Radio
                        className={classes.radioBtn}
                        checked={terminal.id === selectedTerminalId}
                        value={terminal.id}
                        name="terminal"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={terminal.posId}
                      secondary={`${terminal.deviceAddress} S/N ${terminal.serialNumber}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </RadioGroup>

          <Button
            className={classes.submitBtn}
            color="primary"
            data-test-id="getTransactionSearchButton"
            onClick={onSubmitBtnClick}
            variant="contained"
            disabled={!selectedTerminal || !posRefId}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
